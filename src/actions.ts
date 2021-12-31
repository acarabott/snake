import { last } from "@thi.ng/transducers";
import { DB, Direction, Game, Point, SPEED_MAX_MS, SPEED_MIN_MS, State } from "./api";

const getTimeNow_ms = () => performance.now();

// only good for negative values up to -max
const wrap = (value: number, max: number) => (value < 0 ? value + max : value % max);

const isEqual = (a: Point, b: Point) => a[0] === b[0] && a[1] === b[1];

const randomInt = (max: number) => Math.floor(Math.random() * max);

const randomPoint = (shape: Point): Point => [randomInt(shape[0]), randomInt(shape[1])];

const getNextFoodPoint = (state: State): Point | undefined => {
  const maxFoodCount = state.game.shape[0] * state.game.shape[1] - state.game.snake.length;
  if (state.game.food.length === maxFoodCount) {
    return undefined;
  }

  let point: Point;
  do {
    point = randomPoint(state.game.shape);
  } while ([...state.game.food, ...state.game.snake].some((item) => isEqual(item, point)));

  return point;
};

export const getScore = (state: State) => state.game.snake.length - 1;

export const tick = (db: DB) => {
  db.swap((state) => {
    const now_ms = getTimeNow_ms();
    const elapsed_ms = now_ms - state.previousFrame_ms;

    if (elapsed_ms < state.game.tickInterval_ms) {
      return state;
    }

    state.previousFrame_ms = now_ms;

    if (state.game.areYouWinning) {
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
          state.game.areYouWinning = false;
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

          const newFoodItem = getNextFoodPoint(state);
          if (newFoodItem !== undefined) {
            state.game.food.push(newFoodItem);
            state.game.tickInterval_ms = Math.max(SPEED_MIN_MS, state.game.tickInterval_ms * 0.9);
          }
        }
      }
    }

    state.highScore = Math.max(state.highScore, getScore(state));

    return state;
  });
};

const INVALID_DIRECTION_CHANGES: Array<[Direction, Direction]> = [
  ["n", "s"],
  ["e", "w"],
];

const isValidDirectionChange = (newDirection: Direction, currentDirection: Direction) =>
  newDirection !== currentDirection &&
  !INVALID_DIRECTION_CHANGES.some((pair) =>
    pair.every((dir) => dir === newDirection || dir === currentDirection),
  );

export const pushDirection = (db: DB, direction: Direction) => {
  const state = db.deref();

  const currentDirection = last(state.game.directionQueue) ?? state.game.currentDirection;

  if (isValidDirectionChange(direction, currentDirection)) {
    db.resetIn(["game", "directionQueue"], state.game.directionQueue.concat([direction]));
  }
};

export const createGame = (): Game => {
  const gridLength = 10;
  const head: Point = [(gridLength * 0.5) | 0, (gridLength * 0.5) | 0];
  const shape: Point = [gridLength, gridLength];

  const currentDirection = "e";

  return {
    shape,
    snake: [head],
    currentDirection,
    directionQueue: [currentDirection],
    food: [randomPoint(shape)],
    growCount: 0,
    areYouWinning: true,
    tickInterval_ms: SPEED_MAX_MS,
  };
};

export const restartGame = (db: DB) => db.resetIn(["game"], createGame());
