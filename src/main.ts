import { defAtom } from "@thi.ng/atom";
import { start } from "@thi.ng/hdom";
import { State } from "./api";
import { defMainCmp } from "./components/mainCmp";

const app = () => {
  const size = 20;
  const db = defAtom<State>({
    x_count: size,
    y_count: size,
    body: [
      [(size * 0.5) | 0, (size * 0.5) | 0],
      [(size * 0.5) | 0, ((size * 0.5) | 0) + 1],
    ],
  });

  const mainCmp = defMainCmp(db);
  return () => {
    return mainCmp();
  };
};

start(app(), { root: document.body });
