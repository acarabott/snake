import { DB, Direction, Point } from "./api";

const MOVEMENTS: Record<Direction, Point> = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
};

// only good for negative values up to -max
const wrap = (value: number, max: number) => (value < 0 ? value + max : value % max);

const move = (db: DB) => {
  db.swap((state) => {
    console.assert(state.snake.length > 0);

    state.snake = state.snake.map((point, i, arr): Point => {
      if (i === 0) {
        const movement = MOVEMENTS[state.direction];
        const newPoint: Point = [
          wrap(point[0] + movement[0], state.shape[0]),
          wrap(point[1] + movement[1], state.shape[1]),
        ];

        return newPoint;
      }

      return arr[i - 1];
    });

    return state;
  });
};

export const tick = (db: DB) => {
  move(db);
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
