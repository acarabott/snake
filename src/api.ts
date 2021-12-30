import { Atom } from "@thi.ng/atom/atom";

export type Point = [number, number];

export interface State {
  x_count: number;
  y_count: number;

  // direction: "n" | "e" | "s" | "w";
  body: Point[];
  // food: Point[];
}

export type DB = Atom<State>;
