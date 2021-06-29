//basic map test errors
export const NO_START = "No Start";
export const NO_END = "No End";
export const MULTIPLE_START = "Multiple Start";
export const MULTIPLE_END = "Multiple End";
export const MULTIPLE_STARTING_PATHS = "Multiple starting paths";
export const T_FORK = "T fork";
export const FAKE_TURN = "Fake turn";
export const BROKEN_PATH = "Broken path";

const startingPointer = [];
let currentDirection;

//returns array[1,startX,startY,currentDirection] if map is correct (it doesent completly check the BROKEN_PATH part of the problem, its done in other module)
//returns Error array if incorrect
const isCorrectMap = (map) => {
  const errors = [];

  if (
    !basicTests(map, errors) ||
    !initStartingPath(map, errors) ||
    !advancedTests(map, errors)
  ) {
    return errors;
  }

  return [1, ...startingPointer, currentDirection];
};

//basic tests - NO_START|NO_END|MULTIPLE_START|MULTIPLE_END
//returns 1 if passed, 0 if failed with detected error type NO_START|NO_END|MULTIPLE_START|MULTIPLE_END
export const basicTests = (map, errors) => {
  let countAT = 0;
  let countX = 0;
  map.forEach((row) => {
    countAT += (row.match(/@/g) || []).length;
    countX += (row.match(/x/g) || []).length;
  });
  if (countAT == 1 && countX == 1) {
    return 1;
  } else {
    if (countAT == 0) {
      errors.push(NO_START);
    } else if (countAT > 1) {
      errors.push(MULTIPLE_START);
    }

    if (countX == 0) {
      errors.push(NO_END);
    } else if (countX > 1) {
      errors.push(MULTIPLE_END);
    }

    return 0;
  }
};

//advanced tests - T_FORK|FAKE_TURN|BROKEN_PATH
//returns 1 if passed, 0 if failed with detected error type T_FORK|FAKE_TURN|BROKEN_PATH
export const advancedTests = (map, errors) => {
  map.every((row, index) => {
    let position = row.indexOf("+");

    while (position !== -1) {
      let possibleSteps = checkPossibleSteps(map, index, position);
      if (possibleSteps.length < 2) {
        errors.push(BROKEN_PATH);
        return false;
      } else if (possibleSteps.length != 2) {
        errors.push(T_FORK);
        return false;
      } else if (possibleSteps[1] == "up" || possibleSteps[0] == "right") {
        errors.push(FAKE_TURN);
        return false;
      }
      position = row.indexOf("e", position + 1);
    }

    return true;
  });

  if (errors.length == 0) return 1;
  else return 0;
};

//returns 1 if successfull or 0 if unsuccessful with an error MULTIPLE_STARTING_PATHS
export const initStartingPath = (map, errors) => {
  //console.log(map);
  map.every((row, index) => {
    if (row.indexOf("@") == -1) return true;
    else if (checkPossibleSteps(map, index, row.indexOf("@")).length == 1) {
      startingPointer.push(index, row.indexOf("@"));
      currentDirection = checkPossibleSteps(map, index, row.indexOf("@"))[0];
      return false;
    }
  });

  if (startingPointer.length) {
    return 1;
  } else {
    errors.push(MULTIPLE_STARTING_PATHS);
    return 0;
  }
};

//returns array; empty if no posible steps, otherwise members can be "left","right","up","down"
export const checkPossibleSteps = (map, x, y) => {
  //console.log(map);
  let result = [];
  if (
    map[x + 1] != undefined &&
    map[x + 1][y] != undefined &&
    map[x + 1][y] != " " &&
    map[x + 1][y] != "-"
  ) {
    result.push("down");
  }
  if (
    map[x - 1] != undefined &&
    map[x - 1][y] != undefined &&
    map[x - 1][y] != " " &&
    map[x - 1][y] != "-"
  ) {
    result.push("up");
  }
  if (
    map[x][y + 1] != undefined &&
    map[x][y + 1] != " " &&
    map[x][y + 1] != "|"
  ) {
    result.push("right");
  }
  if (
    map[x][y - 1] != undefined &&
    map[x][y - 1] != " " &&
    map[x][y - 1] != "|"
  ) {
    result.push("left");
  }
  return result;
};

export default isCorrectMap;
