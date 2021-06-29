//Checks for folowing errors:
//
//fake turn
//multiple starting paths
//broken path
//T forks
//multiple start
//multiple ends
//no end
//no start

import loadMap from "../src/loadMap.js";
import isCorrectMap from "../src/isCorrectMap.js";

let loadedMap = loadMap("test.txt"); //relative path to the ascii map file
let correctMap = isCorrectMap(loadedMap);

test("Is map correct?", () => {
  expect(correctMap[0]).toBe(1);
});
