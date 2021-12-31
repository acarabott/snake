import { map, range2d } from "@thi.ng/transducers";
import { add2 } from "@thi.ng/vectors";
import { isEmpty, scalePoint } from "../actions";
import { State } from "../api";

export const debugCCmp = (state: State, squareSize: number) =>
  map(
    (point) => [
      [
        "rect",
        {
          stroke: "black",
          fill: isEmpty(state.game, point) ? "rgba(0, 150, 0, 0.3)" : "rgba(0, 0, 0, 0.5)",
        },
        scalePoint(point, squareSize),
        squareSize,
        squareSize,
      ],
      [
        "text",
        { fill: "black", align: "center", baseline: "center" },
        add2([], scalePoint(point, squareSize), [squareSize * 0.5, squareSize * 0.5]),
        isEmpty(state.game, point) ? "empty" : "full",
      ],
    ],
    range2d(...state.game.shape),
  );
