import { defAtom } from "@thi.ng/atom";
import { start } from "@thi.ng/hdom";
import { fromRAF } from "@thi.ng/rstream";
import { createGame } from "./actions";
import { State } from "./api";
import { defMainCmp } from "./components/mainCmp";
import { setupInput } from "./setupInput";
import { tick } from "./tick";

const app = () => {
  const db = defAtom<State>({
    game: createGame(),
    highScore: 0,
    previousFrame_ms: 0,
  });

  // user input
  setupInput(db);

  // world tick
  fromRAF().subscribe({ next: () => tick(db) });

  // gui
  const mainCmp = defMainCmp(db);

  return () => {
    return mainCmp();
  };
};

start(app(), { root: document.body });
