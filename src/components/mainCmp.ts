import { canvas } from "@thi.ng/hdom-canvas";
import { div } from "@thi.ng/hiccup-html/blocks";
import { getScore, scalePoint } from "../actions";
import { DB } from "../api";
import { foodCCmp } from "./foodCCmp";
import { playStateCCmp } from "./playStateCCmp";
import { snakeCCmp } from "./snakeCCmp";

export const defMainCmp = (db: DB) => {
  return () => {
    const state = db.deref();

    const squareSize = 60;

    const [width, height] = scalePoint(state.game.shape, squareSize);

    return div(
      {},
      [
        canvas,
        { width, height, style: { border: "1px black solid" } },

        // food
        foodCCmp(state.game.food, squareSize),

        // snake
        snakeCCmp(state.game.snake, squareSize),

        // play state overlay 
        playStateCCmp(state.game.playState, width, height),

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
