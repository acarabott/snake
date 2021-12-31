import { last } from "@thi.ng/transducers";
import { DB, Direction, Point, State } from "./api";

const MOVEMENTS: Record<Direction, Point> = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
};

// only good for negative values up to -max
const wrap = (value: number, max: number) => (value < 0 ? value + max : value % max);

const randomInt = (max: number) => Math.floor(Math.random() * max);

const isEqual = (a: Point, b: Point) => a[0] === b[0] && a[1] === b[1];

const getNextFoodPoint = (state: State): Point | undefined => {
  const maxFoodCount = state.shape[0] * state.shape[1] - state.snake.length;
  if (state.food.length === maxFoodCount) {
    return undefined;
  }

  const makePoint = (): Point => [randomInt(state.shape[0]), randomInt(state.shape[1])];

  let point: Point;
  do {
    point = makePoint();
  } while (state.food.some((item) => isEqual(item, point)));

  return point;
};

export const tick = (db: DB) => {
  db.swap((state) => {
    {
      // move
      const oldSnake = state.snake;

      state.snake = [];
      oldSnake.forEach((point, i, arr) => {
        if (i === 0) {
          // head moves
          const movement = MOVEMENTS[state.direction];
          const newPoint: Point = [
            wrap(point[0] + movement[0], state.shape[0]),
            wrap(point[1] + movement[1], state.shape[1]),
          ];

          state.snake.push(newPoint);
        } else {
          // the rest move to the position of the point ahead of it
          state.snake.push(arr[i - 1]);
        }
      });

      // grow
      if (state.growCount > 0) {
        state.snake.push(last(oldSnake));
        state.growCount--;
      }
    }

    {
      // eat
      const head = state.snake[0];
      const previousFoodCount = state.food.length;

      state.food = state.food.filter((item) => !isEqual(item, head));

      if (state.food.length !== previousFoodCount) {
        state.growCount++;

        const newFoodItem = getNextFoodPoint(state);
        if (newFoodItem !== undefined) {
          state.food.push(newFoodItem);
        }
      }
    }

    return state;
  });
};

const INVALID_DIRECTION_CHANGES: Array<[Direction, Direction]> = [
  ["n", "s"],
  ["e", "w"],
];
export const setDirection = (db: DB, direction: Direction) => {
  const state = db.deref();
  const isValid = !INVALID_DIRECTION_CHANGES.some((pair) =>
    pair.every((dir) => dir === direction || dir === state.direction),
  );
  if (isValid) {
    db.resetIn(["direction"], direction);
  }
};
