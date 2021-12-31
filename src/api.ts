import { Atom } from "@thi.ng/atom/atom";

export const SPEED_MAX_MS = 500;
export const SPEED_MIN_MS = 25;

export type Point = [number, number];
export type Direction = "n" | "e" | "s" | "w";
export type Snake = Point[];
export interface Game {
  shape: [number, number];
  direction: Direction;
  snake: Snake;
  food: Point[];
  growCount: number;
  areYouWinning: boolean;
  tickInterval_ms: number;
}

export interface State {
  game: Game;
  highScore: number;
  previousFrame_ms: number;
}

export type DB = Atom<State>;
