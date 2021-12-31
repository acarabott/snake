import { Atom } from "@thi.ng/atom/atom";

export const SPEED_MAX_MS = 300;
export const SPEED_MIN_MS = 25;

export type Point = [number, number];
export type Direction = "n" | "e" | "s" | "w";
export type Snake = Point[];
export type Food = Point[];
export type PlayState = "playing" | "win" | "lose";

export interface Game {
  shape: [number, number];
  directionQueue: Direction[];
  currentDirection: Direction;
  snake: Snake;
  food: Food;
  growCount: number;
  playState: PlayState;
  tickInterval_ms: number;
}

export interface State {
  game: Game;
  highScore: number;
  previousFrame_ms: number;
}

export type DB = Atom<State>;
