import { fromDOMEvent } from "@thi.ng/rstream/event";
import { pushDirection, restartGame } from "./actions";
import { DB, Direction } from "./api";

export const setupInput = (db: DB) => {
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
};
