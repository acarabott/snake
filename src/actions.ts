import { inRange } from "@thi.ng/math";
import { pickRandom } from "@thi.ng/random";
import { filter, last, range2d } from "@thi.ng/transducers";
import { mul2 } from "@thi.ng/vectors/mul";
import { DB, Direction, Game, Point, SPEED_MAX_MS, SPEED_MIN_MS, State } from "./api";

export const isEqual = (a: Point, b: Point) => a[0] === b[0] && a[1] === b[1];

export const scalePoint = (point: Point, squareSize: number): Point =>
  mul2([], point, [squareSize, squareSize]) as Point;

export const isEmpty = (game: Game, point: Point): boolean => {
  return !(
    game.snake.some((snakePoint) => isEqual(point, snakePoint)) ||
    game.food.some((foodPoint) => isEqual(point, foodPoint))
  );
};

export const getNextFoodPoint = (game: Game): Point | undefined => {
  return pickRandom([...filter((point) => isEmpty(game, point), range2d(...game.shape))]);
};

export const getScore = (state: State) => state.game.snake.length - 1;

export const pushDirection = (db: DB, direction: Direction) => {
  const state = db.deref();

  const currentDirection = last(state.game.directionQueue) ?? state.game.currentDirection;

  const INVALID_DIRECTION_CHANGES: Array<[Direction, Direction]> = [
    ["n", "s"],
    ["e", "w"],
  ];
  const isValidDirectionChange =
    direction !== currentDirection &&
    !INVALID_DIRECTION_CHANGES.some((pair) =>
      pair.every((dir) => dir === direction || dir === currentDirection),
    );
  if (isValidDirectionChange) {
    db.resetIn(["game", "directionQueue"], state.game.directionQueue.concat([direction]));
  }
};

export const createGame = (): Game => {
  const gridLength = 9;
  const head: Point = [(gridLength * 0.5) | 0, (gridLength * 0.5) | 0];
  const shape: Point = [gridLength, gridLength];

  const currentDirection = "e";

  const game: Game = {
    shape,
    snake: [head],
    currentDirection,
    directionQueue: [],
    food: [],
    growCount: 0,
    playState: "playing",
    tickInterval_ms: SPEED_MAX_MS,
  };

  const food = getNextFoodPoint(game);
  if (food === undefined) {
    throw new Error("Could not create first piece of food");
  }
  game.food.push(food);

  console.assert(shape[0] > 0 && shape[1] > 0);
  console.assert(game.snake.length > 0);
  console.assert(game.directionQueue.length === 0);
  console.assert(game.food.length > 0);
  console.assert(game.growCount === 0);
  console.assert(game.playState === "playing");
  console.assert(inRange(game.tickInterval_ms, SPEED_MIN_MS, SPEED_MAX_MS));

  return game;
};

export const restartGame = (db: DB) => db.resetIn(["game"], createGame());
