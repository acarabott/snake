import { mapIndexed, reverse } from "@thi.ng/transducers";
import { scalePoint } from "../actions";
import { Snake } from "../api";

export const snakeCCmp = (snake: Snake, squareSize: number) =>
  mapIndexed(
    (i, point) => [
      "rect",
      { fill: i === snake.length - 1 ? "red" : "black" },
      scalePoint(point, squareSize),
      squareSize,
      squareSize,
    ],
    reverse(snake), // render in reverse so the head is always on top during collisions
  );
