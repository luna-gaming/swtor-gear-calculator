function calculate() {
  console.log("1 " + new Date())
  var usingStim = document.getElementById("stim").checked;
  var accuracyGoal = document.getElementById("accuracy").value - (usingStim ? 264 : 0);
  var alacrityGoal = document.getElementById("alacrity").value;
  var augmentType = document.getElementById("augment").value;
  
  var critEnhancement = critEnhancements[document.getElementById("crit").value];

  // get the available accuracy and alacrity options meeting the specified stat goals
  var accuracyOptions = getStatOptions(accuracyEnhancements, accuracyGoal, augmentType);
  var alacrityOptions = getStatOptions(alacrityEnhancements, alacrityGoal, augmentType);

  var combinedResults = [];
  var crit = 0;
  var power = 0;
  var endurance = 0;
  
  // loop through all combinations of accuracy and alacrity layouts
  for (var accuracyId in accuracyOptions) {
    var accuracy = accuracyOptions[accuracyId];
    for (var alacrityId in alacrityOptions) {
      var alacrity = alacrityOptions[alacrityId];

      // determine crit layout
      var numEnhancements = 7 - accuracy.numEnhancements - alacrity.numEnhancements;
      var numAugments = (augmentType == "none" ? 0 : 14) - 
          accuracy.numAugments - alacrity.numAugments;
      var numImplants = 3 - accuracy.numImplants - alacrity.numImplants;
      var crystals = 2;
      
      var critResult = new Result(
          new Layout(numEnhancements, numAugments, numImplants), new EnhancementOptions());

      // check if valid configuration
      if (numEnhancements < 0 || numAugments < 0 || numImplants < 0) {
        continue;
      }

      var newCrit = (numEnhancements*critEnhancement[TERTIARY]) + (numImplants*implant[TERTIARY]) + 
          (numAugments*augments[augmentType][TERTIARY]) + (crystals*41) + (usingStim ? 109 : 0);
      var newPower = (numEnhancements*critEnhancement[POWER]) + (numImplants*implant[POWER]) + 
          (numAugments*augments[augmentType][POWER]) + accuracy.power + alacrity.power;
      var newEndurance = (numEnhancements*critEnhancement[ENDURANCE]) + (numImplants*implant[ENDURANCE]) + 
          (numAugments*augments[augmentType][ENDURANCE]) + accuracy.endurance + alacrity.endurance;

      // prioritize crit then power then endurance
      if (newCrit > crit || (newCrit == crit && (newPower > power || (newPower == power && newEndurance > endurance)))) {
        crit = newCrit;
        power = newPower;
        endurance = newEndurance;
        combinedResults = [];
        combinedResults.push(new CombinedResult(accuracy, alacrity, critResult));
      }
      else if (newCrit == crit && newPower == power && newEndurance == endurance) {
        combinedResults.push(new CombinedResult(accuracy, alacrity, critResult));
      }
    }
  }

  console.log(accuracyOptions)
  console.log(alacrityOptions)
  console.log(combinedResults)
  
  drawResults(crit, power, endurance, combinedResults);
  
  console.log("2 " + new Date())
}

function getStatOptions(enhancements, goal, augmentType) {
  var maxTertiary = maxByProp(enhancements, TERTIARY)[TERTIARY];

  var results = [];

  // loop 0-3 implants/ear piece
  for(var numImplants = 0; numImplants <= 3; numImplants++) {
    // loop 0-14 augments if augments are used
    var maxAugments = augmentType == "none" ? 0 : 14;
    for (var numAugments = 0; numAugments <= maxAugments; numAugments++) {
      // calculated goal enhancements need to reach and number of enhancements required
      var newGoal = goal - (augments[augmentType][TERTIARY] * numAugments) - (implant[TERTIARY] * numImplants);
      var numEnhancements = Math.max(Math.ceil(newGoal / maxTertiary), 0);

      // initialize result parameters
      var layout = new Layout(numEnhancements, numAugments, numImplants);
      var enhancementOptions = new EnhancementOptions();

      // if more than 7 enhancements are needed, stop
      // if 0 enhancements are needed, return result. don't need to calculte further
      if (numEnhancements > 7) {
        continue;
      }
      else if (numEnhancements == 0) {
        enhancementOptions.setIfBetter(enhancements, [], layout, augmentType);
        results.push(new Result(layout, enhancementOptions));
        break;
      }

      // funky magic math to help exploit the "almost" linearity of enhancements
      var average = newGoal / numEnhancements;
      var bestIndex = indexOfLastByProp(enhancements, TERTIARY, function(val) { return val >= average; });
      var tertiaryAtIndex = enhancements[bestIndex][TERTIARY];
      var targetIndexSum = Math.min(
            (bestIndex * numEnhancements) + Math.ceil(((tertiaryAtIndex * numEnhancements) - newGoal) / 2.0),
            (enhancements.length - 1) * numEnhancements);

      // if only 1 enhancement needed, just use the best index. else do real math
      if (numEnhancements == 1) {
        enhancementOptions.setIfBetter(enhancements,[bestIndex],layout,augmentType)
        results.push(new Result(layout, enhancementOptions));
      } else {
        for (var i = 0; i < 30; i++) {
          loopFunction(augmentType, enhancements, enhancementOptions, layout, targetIndexSum,
              newGoal, [i], 0, numEnhancements - 2)
        }
        results.push(new Result(layout, enhancementOptions))
      }
    }
  }

  return results;
}

function loopFunction(augmentType, enhancements, enhancementOptions, layout, targetIndexSum, goal,
    values, index, level) {
  // if this is the last enhancement to be found...
  if (level == 0) {
    // calculate the last enhancement's index which is the remainder of the targetIndexSum
    var final = Math.min(targetIndexSum - sumArray(values), enhancements.length-1);
    // copy the array of indexes and add the new index to the copy
    var newValues = [...values];
    newValues.push(final);
    // check that a valid value was found and we achieved targetIndexSum
    if (values[values.length - 1] <= final && sumArray(newValues) == targetIndexSum) {
      // correct for now quite linearity of enhancements (some enhancements have a difference of 3 instead of 2)
      var sum = sumByProp(newValues.map(i => enhancements[i]), TERTIARY)
      while (sum < goal && final > 0) {
        newValues.pop();
        final--;
        newValues.push(final)
        sum = sumByProp(newValues.map(i => enhancements[i]), TERTIARY)
      }
      // if we met our tertiary goal, update the solution
      if (sum >= goal) {
        enhancementOptions.setIfBetter(enhancements, newValues, layout, augmentType);
      }
    }
  } else {
    // loop through the list of enhancement indexes, starting at the index of the previous enhancement
    for(var i = values[index]; i <= Math.ceil(targetIndexSum/2.0)-values[index]; i++) {
      // copy the array of indexes and add the new index to the copy
      var newValues = [...values];
      newValues.push(i);
      // go to next inner loop
      loopFunction(augmentType, enhancements, enhancementOptions, layout, targetIndexSum, goal,
            newValues, index+1, level-1);
    }
  }
}
