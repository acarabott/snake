import { defAtom } from "@thi.ng/atom";
import { start } from "@thi.ng/hdom";
import { fromInterval } from "@thi.ng/rstream";
import { tick } from "./actions";
import { Point, State } from "./api";
import { defMainCmp } from "./components/mainCmp";

/* 

TODO

- movement system allows for illegal moves, by commiting two legal moves within one tick
*/

const app = () => {
  const size = 20;
  const head: Point = [(size * 0.5) | 0, (size * 0.5) | 0];

  const db = defAtom<State>({
    shape: [size, size],
    snake: [head, [head[0] - 1, head[1]], [head[0] - 2, head[1]]],
    direction: "e",
    food: [[(size * 0) | 0, (size * 0) | 0]],
    growCount: 0,
  });

  console.assert(db.deref().snake.length > 0);

  const mainCmp = defMainCmp(db);

  const physicsClock = fromInterval(100);
  physicsClock.subscribe({
    next: () => {
      tick(db);
    },
  });

  return () => {
    return mainCmp();
  };
};

start(app(), { root: document.body });
