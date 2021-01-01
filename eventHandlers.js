function onClick() {
  var results = document.getElementById("results");
  results.innerHTML = `
  Calculating...<br>
  This may take a couple minutes.<br>
  Please do not stop the script.
  `
  setTimeout(calculate, 10);
}

function onLoad() {
  var critElement = document.getElementById("crit");
  for(var id in critEnhancements) {
    var opt = document.createElement("option");
    var enhancement = critEnhancements[id];
    opt.text = enhancement.name + " (e:" + enhancement[ENDURANCE] + ", p:" + 
        enhancement[POWER] + ", t:" + enhancement[TERTIARY] + ")";
    opt.value = id;
    critElement.add(opt);
  }
  
  var augElement = document.getElementById("augment");
  for(var id in augments) {
    var opt = document.createElement("option");
    var augment = augments[id];
    opt.text = id + " (" + augment["rating"] + ") (e:" + augment[ENDURANCE] + ", p:" + 
        augment[POWER] + ", t:" + augment[TERTIARY] + ")";
    opt.value = id;
    augElement.add(opt);
  }
  augElement.selectedIndex = 2;
}