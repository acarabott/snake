import { map } from "@thi.ng/transducers/map";
import { add2 } from "@thi.ng/vectors/add";
import { scalePoint } from "../actions";
import { Food } from "../api";

export const foodCCmp = (food: Food, squareSize: number) =>
  map(
    (point) => [
      "circle",
      { fill: "rgb(43, 156, 212)" },
      add2([], scalePoint(point, squareSize), [squareSize * 0.5, squareSize * 0.5]),
      squareSize * 0.5,
    ],
    food,
  );
