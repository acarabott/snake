import { canvas } from "@thi.ng/hdom-canvas";
import { div } from "@thi.ng/hiccup-html/blocks";
import { map, mapIndexed, reverse } from "@thi.ng/transducers";
import { add2 } from "@thi.ng/vectors";
import { getScore, scalePoint } from "../actions";
import { DB, Point, Snake } from "../api";
import { playStateCCmp } from "./gameOverCCmp";

const snakeCCmp = (snake: Snake, squareSize: number) =>
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

export const defMainCmp = (db: DB) => {
  return () => {
    const state = db.deref();

    const squareSize = 60;

    const foodCCmp = (point: Point) => [
      "circle",
      { fill: "rgb(43, 156, 212)" },
      add2([], scalePoint(point, squareSize), [squareSize * 0.5, squareSize * 0.5]),
      squareSize * 0.5,
    ];

    const [width, height] = scalePoint(state.game.shape, squareSize);

    return div(
      {},
      [
        canvas,
        { width, height, style: { border: "1px black solid" } },

        // food
        map((point) => foodCCmp(point), state.game.food),

        // snake
        snakeCCmp(state.game.snake, squareSize),

        // game over over lay
        state.game.playState !== "playing"
          ? playStateCCmp(state.game.playState, width, height)
          : null,

        // debug
        // debugCCmp(state, squareSize),
      ],
      // div(
      //   {},
      //   `Speed: ${fitClamped(
      //     state.game.tickInterval_ms,
      //     SPEED_MAX_MS,
      //     SPEED_MIN_MS,
      //     0,
      //     100,
      //   ).toFixed(1)}%`,
      // ),
      div({}, `Score: ${getScore(state)}`),
      div({}, `High Score: ${state.highScore}`),

      // div({}, `direction queue: ${state.game.directionQueue.join(", ")}`),
    );
  };
};
