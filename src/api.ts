import { Atom } from "@thi.ng/atom/atom";

export type Point = [number, number];
export type Direction = "n" | "e" | "s" | "w";

export interface State {
  shape: [number, number];
  direction: Direction;
  snake: Point[];
  // food: Point[];
}

export type DB = Atom<State>;
