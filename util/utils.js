const POWER = "power";
const ENDURANCE = "endurance";
const TERTIARY = "tertiary";

function maxByProp(objects, prop) {
  var maxObj = null;
  var max = 0;

  for(id in objects) {
    if(objects[id][prop] > max) {
      max = objects[id][prop];
      maxObj = objects[id];
    }
  }

  return maxObj;
}

function minByProp(objects, prop) {
  var minObj = null;
  var min = Number.MAX_SAFE_INTEGER;

  for(var id in objects) {
    if(objects[id][prop] < min) {
      min = objects[id][prop];
      minObj = objects[id];
    }
  }

  return minObj;
}

function sumByProp(objects, prop) {
  var sum = 0;
  for(var id in objects) {
    sum += objects[id][prop];
  }
  return sum;
}

function indexOfLastByProp(objects, prop, func) {
  var lastThing = null;

  for(var id in objects) {
    if(func(objects[id][prop])) {
      lastThing = id;
    }
  }

  return lastThing;
}

function sumArray(arr) {
  return arr.reduce((a,b) => a+b, 0);
}

function drawResults(crit, power, endurance, results) {
  var resultDiv = document.getElementById("results");
  resultDiv.innerHTML = `
  <hr>
  <table id="resultTable">
    <tr><td>Crit:</td><td>${crit}</td></tr>
    <tr><td>Power:</td><td>${power}</td></tr>
    <tr><td>Endurance:</td><td>${endurance}</td></tr>
    <tr><td>Loadouts:</td><td>${results.length}</td></tr>
  </table>
  `;

  var loadoutsDiv = document.getElementById("loadouts");
  loadoutsDiv.innerHTML = "";
  for(var i in results) {
    result = results[i];
  
    // start loadout section
    loadoutsDiv.innerHTML += `
    <div class="section">
      <span>LOADOUT ${parseInt(i)+1}<hr></span>
      <div>
        <div class="left">
          <span>Alacrity</span><br>
          Augments: ${result.alacrityResult.numAugments}<br>
          Implants: ${result.alacrityResult.numImplants}<br>
          Enhancements: ${result.alacrityResult.numEnhancements}
          <hr>
          <span>Accuracy</span><br>
          Augments: ${result.accuracyResult.numAugments}<br>
          Implants: ${result.accuracyResult.numImplants}<br>
          Enhancements: ${result.accuracyResult.numEnhancements}
          <hr>
          <span>Crit</span><br>
          Augments: ${result.critResult.numAugments}<br>
          Implants: ${result.critResult.numImplants}<br>
          Enhancements: ${result.critResult.numEnhancements}
        </div>
        <div class="right">
          <span>Alacrity Enhancements</span> (choose 1 row)<br>
          <table id="alacrityTable"></table>
          <hr>
          <span>Accuracy Enhancments</span> (choose 1 row)<br>
          <table id="accuracyTable"></table>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <br style="margin-top: 6px">
    `;
    var alacrityTable = document.getElementById("alacrityTable");
    var alacrityOptions = result.alacrityResult.options;
    drawEnhancementTable(alacrityTable, alacrityOptions);
  
    var accuracyTable = document.getElementById("accuracyTable");
    var accuracyOptions = result.accuracyResult.options;
    drawEnhancementTable(accuracyTable, accuracyOptions);       
  }
}

function drawEnhancementTable(table, options) {
  for(var j in options){
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.innerHTML = (parseInt(j)+1)+":";
    row.append(cell);
    var opt = options[j];
    for(var id in opt) {
      cell = document.createElement("td");
      cell.innerHTML = opt[id].name + (id == opt.length-1?"":",");
      row.append(cell);
    }
    table.append(row);
  } 
}