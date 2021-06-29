import loadMap from "./src/loadMap.js";
import isCorrectMap from "./src/isCorrectMap.js";
import pathFinder from "./src/pathFinder.js";

let loadedMap = loadMap("test.txt"); //relative path to the ascii map file
let correctMap = isCorrectMap(loadedMap);

if (correctMap[0] != 1) {
  console.log("Errors in map: " + correctMap.join());
} else {
  let path = new pathFinder(
    loadedMap,
    correctMap[1],
    correctMap[2],
    correctMap[3]
  );
  while (path.tryStep()) {}
}
