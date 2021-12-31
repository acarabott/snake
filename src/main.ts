import { defAtom } from "@thi.ng/atom";
import { start } from "@thi.ng/hdom";
import { fromInterval } from "@thi.ng/rstream";
import { tick } from "./actions";
import { Point, State } from "./api";
import { defMainCmp } from "./components/mainCmp";

const app = () => {
  const size = 20;
  const head: Point = [(size * 0.5) | 0, (size * 0.5) | 0];

  const db = defAtom<State>({
    shape: [size, size],
    snake: [head, [head[0] - 1, head[1]], [head[0] - 2, head[1]]],
    direction: "e",
  });

  const mainCmp = defMainCmp(db);

  const physicsClock = fromInterval(500);
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
