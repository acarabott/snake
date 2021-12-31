import { defAtom } from "@thi.ng/atom";
import { start } from "@thi.ng/hdom";
import { fromDOMEvent, fromRAF } from "@thi.ng/rstream";
import { createGame, getTimeNow_ms, restartGame, setDirection, tick } from "./actions";
import { Direction, State } from "./api";
import { defMainCmp } from "./components/mainCmp";

/* 

TODO

- movement system allows for illegal moves, by commiting two legal moves within one tick
*/

const app = () => {
  const db = defAtom<State>({
    game: createGame(),
    highScore: 0,
    previousFrame_ms: getTimeNow_ms(),
  });

  console.assert(db.deref().game.snake.length > 0);

  const mainCmp = defMainCmp(db);

  const keyboardStream = fromDOMEvent(document.body, "keydown");

  keyboardStream.subscribe({
    next: (event) => {
      const state = db.deref();
      if (state.game.areYouWinning) {
        const direction: Direction | undefined = (
          {
            ArrowUp: "n",
            ArrowRight: "e",
            ArrowDown: "s",
            ArrowLeft: "w",
          } as const
        )[event.code];
        if (direction !== undefined) {
          event.preventDefault();
          setDirection(db, direction);
        }
      } else {
        restartGame(db);
      }
    },
  });

  fromRAF().subscribe({
    next: () => {
      tick(db);
    },
  });

  return () => {
    return mainCmp();
  };
};

start(app(), { root: document.body });
