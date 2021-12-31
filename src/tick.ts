import { last } from "@thi.ng/transducers";
import { getNextFoodPoint, getScore, isEqual } from "./actions";
import { DB, Direction, Point, SPEED_MIN_MS } from "./api";

export const tick = (db: DB) => {
  db.swap((state) => {
    const now_ms = performance.now();
    const elapsed_ms = now_ms - state.previousFrame_ms;

    if (elapsed_ms < state.game.tickInterval_ms) {
      return state;
    }

    state.previousFrame_ms = now_ms;

    if (state.game.playState === "playing") {
      {
        // update direction
        // ---------------------------------------------------------------------
        const direction = state.game.directionQueue.shift() ?? state.game.currentDirection;
        state.game.currentDirection = direction;

        // move
        // ---------------------------------------------------------------------
        const oldSnake = state.game.snake;
        state.game.snake = [];
        oldSnake.forEach((point, i, arr) => {
          if (i === 0) {
            // head moves
            const movement = (
              {
                n: [0, -1],
                e: [1, 0],
                s: [0, 1],
                w: [-1, 0],
              } as Record<Direction, Point>
            )[direction];

            // only good for negative values down to -max
            const wrap = (value: number, max: number) => (value < 0 ? value + max : value % max);

            const newPoint: Point = [
              wrap(point[0] + movement[0], state.game.shape[0]),
              wrap(point[1] + movement[1], state.game.shape[1]),
            ];

            state.game.snake.push(newPoint);
          } else {
            // the rest move to the position of the point ahead of it
            state.game.snake.push(arr[i - 1]);
          }
        });

        // grow
        // ---------------------------------------------------------------------
        if (state.game.growCount > 0) {
          state.game.snake.push(last(oldSnake));
          state.game.growCount--;
        }
      }

      {
        // check for collisions
        // ---------------------------------------------------------------------
        if (
          state.game.snake.some((pointA, i) =>
            state.game.snake.some((pointB, j) => i !== j && isEqual(pointA, pointB)),
          )
        ) {
          state.game.playState = "lose";
        }
      }

      {
        // eat
        // ---------------------------------------------------------------------

        const head = state.game.snake[0];
        const previousFoodCount = state.game.food.length;

        state.game.food = state.game.food.filter((item) => !isEqual(item, head));

        if (state.game.food.length !== previousFoodCount) {
          state.game.growCount++;

          const newFoodItem = getNextFoodPoint(state.game);
          if (newFoodItem !== undefined) {
            state.game.food.push(newFoodItem);
            state.game.tickInterval_ms = Math.max(SPEED_MIN_MS, state.game.tickInterval_ms * 0.9);
          } else {
            state.game.playState = "win";
          }
        }
      }
    }

    state.highScore = Math.max(state.highScore, getScore(state));

    return state;
  });
};
