class CombinedResult {
  constructor(accuracyResult, alacrityResult, critResult) {
    this.accuracyResult = accuracyResult;
    this.alacrityResult = alacrityResult;
    this.critResult = critResult;
  }
}

class Result {
  constructor(layout, enhancementOptions) {
    this.numEnhancements = layout.numEnhancements;
    this.numAugments = layout.numAugments;
    this.numImplants = layout.numImplants;
    this.power = enhancementOptions.power;
    this.endurance = enhancementOptions.endurance;
    this.options = enhancementOptions.options;
    // this.layout = layout;
    // this.enhancementOptions = enhancementOptions;
  }
}

class Layout {
  constructor(numEnhancements, numAugments, numImplants) {
    this.numEnhancements = numEnhancements;
    this.numAugments = numAugments;
    this.numImplants = numImplants;
  }
}

class EnhancementOptions {
  constructor() {
    this.power = 0;
    this.endurance = 0;
    this.options = [];
  }

  add(option, power, endurance) {
    this.options.push(option);
    this.power = power;
    this.endurance = endurance;
  }

  setIfBetter(enhancements, indexes, layout, augmentType) {
    var mappedIndexes = indexes.map(i => enhancements[i]);

    var newPower = sumByProp(mappedIndexes, POWER) +
        (implant[POWER] * layout.numImplants) +
        (augments[augmentType][POWER] * layout.numAugments);

    var newEndurance = sumByProp(mappedIndexes, ENDURANCE) +
        (implant[ENDURANCE] * layout.numImplants) +
        (augments[augmentType][ENDURANCE] * layout.numAugments);

    // if this option is better, clear the old option and save this one.
    // if its the same, add it as an additional option
    // prioritize power then endurance when comparing
    if (newPower > this.power || (newPower == this.power && newEndurance > this.endurance)) {
      this.options = [];
      this.add(mappedIndexes, newPower, newEndurance);
    }
    else if (newPower == this.power && newEndurance == this.endurance) {
      this.add(mappedIndexes, newPower, newEndurance);
    }
  }
}