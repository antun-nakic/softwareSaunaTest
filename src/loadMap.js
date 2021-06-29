import { readFileSync } from "fs";

const array2D = (path) => {
  try {
    const data = readFileSync(path, "utf8");

    return data.split("\r\n");
  } catch (err) {
    console.error(err);
  }
};

export default array2D;
