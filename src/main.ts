import { defAtom } from "@thi.ng/atom";
import { start } from "@thi.ng/hdom";
import { fromDOMEvent, fromRAF } from "@thi.ng/rstream";
import { createGame, pushDirection, restartGame, tick } from "./actions";
import { Direction, State } from "./api";
import { defMainCmp } from "./components/mainCmp";

const app = () => {
  const db = defAtom<State>({
    game: createGame(),
    highScore: 0,
    previousFrame_ms: 0,
  });

  console.assert(db.deref().game.snake.length > 0);

  const mainCmp = defMainCmp(db);

  const keyboardStream = fromDOMEvent(document.body, "keydown");

  keyboardStream.subscribe({
    next: (event) => {
      const state = db.deref();
      if (state.game.areYouWinning) {
        let direction: Direction | undefined;
        switch (event.code) {
          case "ArrowUp":
          case "KeyW":
            direction = "n";
            break;
          case "ArrowRight":
          case "KeyD":
            direction = "e";
            break;
          case "ArrowDown":
          case "KeyS":
            direction = "s";
            break;
          case "ArrowLeft":
          case "KeyA":
            direction = "w";
            break;

          default:
            break;
        }
        if (direction !== undefined) {
          event.preventDefault();
          pushDirection(db, direction);
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
