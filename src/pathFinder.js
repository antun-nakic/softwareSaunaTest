class pathFinder {
  constructor(map, x, y, direction) {
    this.map = map;
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  validNoLetterChars = ["-", "|", "+"];
  validLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  takenSteps = [];
  letters = [];
  charPath = ["@"];

  //returns 1 if successfull; 0 if error
  tryStep() {
    let evaluation;
    let nextStepCoordinates;
    //console.log("---------");
    //console.log("current pointer: " + this.x + "  " + this.y);
    //console.log("current direction: " + this.direction);
    switch (this.direction) {
      case "up":
        nextStepCoordinates = [this.x - 1, this.y];
        evaluation = this.findChar(this.x - 1, this.y);
        if (!this.evaluateStep(evaluation, nextStepCoordinates)) return 0;
        this.x -= 1;
        break;
      case "down":
        nextStepCoordinates = [this.x + 1, this.y];
        evaluation = this.findChar(this.x + 1, this.y);
        if (!this.evaluateStep(evaluation, nextStepCoordinates)) return 0;
        this.x += 1;
        break;
      case "left":
        nextStepCoordinates = [this.x, this.y - 1];
        evaluation = this.findChar(this.x, this.y - 1);
        if (!this.evaluateStep(evaluation, nextStepCoordinates)) return 0;
        this.y -= 1;
        break;
      case "right":
        nextStepCoordinates = [this.x, this.y + 1];
        evaluation = this.findChar(this.x, this.y + 1);
        if (!this.evaluateStep(evaluation, nextStepCoordinates)) return 0;
        this.y += 1;
        break;
    }
    return 1;
  }

  //evaluates the step completly, if there is an error, it logs it into console returns 0;
  //if no error, it puts char in array/s and moves the pointer in map
  evaluateStep(evaluation, nextStepCoordinates) {
    //console.log("Found: " + evaluation.type + "  " + evaluation.char);
    if (evaluation.type == "letter") {
      this.acceptLetter(evaluation.char, nextStepCoordinates);
      if (this.neededDirectionChangeAfterLetter(this.x, this.y))
        this.changeDirection();
    } else if (evaluation.type.indexOf("joint") != -1) {
      if (
        !this.acceptJoint(evaluation.type, evaluation.char, nextStepCoordinates)
      ) {
        console.log("BROKEN_PATH");
        console.log(this.letters.join(""));
        console.log(this.charPath.join(""));
        return 0;
      }
    } else if (evaluation.type == "turn") {
      this.acceptTurn(evaluation.char);
      return "turn-done";
    } else if (evaluation.type == "invalid") {
      console.log("BROKEN_PATH");
      console.log(this.letters.join(""));
      console.log(this.charPath.join(""));
      return 0;
    } else if (evaluation.type == "success") {
      this.charPath.push("x");
      console.log("SUCCESS");
      console.log(this.letters.join(""));
      console.log(this.charPath.join(""));
      return 0;
    }
    return 1;
  }

  //returns an object containing type of char found and also the exact char
  //if error ocurus, it returns property type:"invalid"
  findChar(posX, posY) {
    //console.log(posX);
    let char = this.map[posX].charAt(posY);
    if (this.validNoLetterChars.includes(char)) {
      //validNoLetterChar
      if (char == "+") return { type: "turn", char: char };
      else if (char == "-") return { type: "joint-hor", char: char };
      else return { type: "joint-ver", char: char };
    } else if (this.validLetters.includes(char)) {
      //validLetter
      return { type: "letter", char: char };
    } else if (char == "x") {
      //validLetter
      return { type: "success", char: char };
    } else {
      //invalidPath
      return { type: "invalid", char: char };
    }
  }

  acceptLetter(letter, nextStepCoordinates) {
    if (
      !this.takenSteps.some(
        (r) => nextStepCoordinates[0] == r[0] && nextStepCoordinates[1] == r[1]
      )
    )
      this.letters.push(letter);

    this.charPath.push(letter);
    this.takenSteps.push([this.x, this.y]);
  }
  acceptJoint(type, joint, nextStepCoordinates) {
    if (
      this.takenSteps.some(
        (r) => nextStepCoordinates[0] == r[0] && nextStepCoordinates[1] == r[1]
      ) ||
      (type == "joint-hor" &&
        (this.direction == "left" || this.direction == "right")) ||
      (type == "joint-ver" &&
        (this.direction == "up" || this.direction == "down"))
    ) {
      this.charPath.push(joint);
      this.takenSteps.push([this.x, this.y]);
      return 1;
    } else {
      //console.log(nextStepCoordinates);
      //console.log(this.takenSteps.includes(nextStepCoordinates));
      //console.log(this.takenSteps);
      return 0;
    }
  }
  acceptTurn(turn) {
    this.charPath.push(turn);
    this.takenSteps.push([this.x, this.y]);
    this.changeDirection();
  }

  changeDirection() {
    if (this.direction == "up") {
      if (
        this.map[this.x - 1][this.y - 1] != undefined &&
        this.map[this.x - 1][this.y - 1] != " "
      ) {
        this.direction = "left";
      } else {
        this.direction = "right";
      }
    } else if (this.direction == "down") {
      if (
        this.map[this.x + 1][this.y - 1] != undefined &&
        this.map[this.x + 1][this.y - 1] != " "
      ) {
        this.direction = "left";
      } else {
        this.direction = "right";
      }
    } else if (this.direction == "right") {
      if (
        this.map[this.x - 1] != undefined &&
        this.map[this.x - 1][this.y + 1] != undefined &&
        this.map[this.x - 1][this.y + 1] != " "
      ) {
        this.direction = "up";
      } else {
        this.direction = "down";
      }
    } else if (this.direction == "left") {
      if (
        this.map[this.x - 1] != undefined &&
        this.map[this.x - 1][this.y - 1] != undefined &&
        this.map[this.x - 1][this.y - 1] != " "
      ) {
        this.direction = "up";
      } else {
        this.direction = "down";
      }
    }
  }

  neededDirectionChangeAfterLetter(posX, posY) {
    let char;

    if (this.direction == "up" && this.map[posX - 2] != undefined) {
      char = this.map[posX - 2].charAt(posY);
    } else if (this.direction == "down" && this.map[posX + 2]) {
      char = this.map[posX + 2].charAt(posY);
    } else if (this.direction == "left") {
      char = this.map[posX].charAt(posY - 2);
    } else if (this.direction == "right") {
      char = this.map[posX].charAt(posY + 2);
    } else {
      char = "invalid";
    }

    if (
      this.validNoLetterChars.includes(char) ||
      this.validLetters.includes(char) ||
      char == "x"
    )
      return 0;
    else return 1;
  }
}

export default pathFinder;
