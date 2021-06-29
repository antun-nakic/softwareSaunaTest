import loadMap from "../src/loadMap.js";

loadMap("test.txt").forEach((red) => {
  test("Loading ascii from file into 2D array", () => {
    expect(red).toEqual(expect.any(String));
  });
});
