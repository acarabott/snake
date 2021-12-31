import { ILifecycle } from "@thi.ng/hdom";
import { canvas } from "@thi.ng/hdom-canvas";
import { div } from "@thi.ng/hiccup-html/blocks";
import { fromDOMEvent } from "@thi.ng/rstream";
import { GestureStream, gestureStream } from "@thi.ng/rstream-gestures";
import { map, mapIndexed } from "@thi.ng/transducers";
import { add2, mul2 } from "@thi.ng/vectors";
import { setDirection } from "../actions";
import { DB, Direction, Point } from "../api";

export const defMainCmp = (db: DB) => {
  let gestures: GestureStream;
  const canvasEl: ILifecycle = {
    ...canvas,

    init: (canvasEl: HTMLCanvasElement) => {
      const opts = {
        preventScrollOnZoom: true,
      };
      gestures = gestureStream(canvasEl, opts);
    },
  };

  const keyboardStream = fromDOMEvent(document.body, "keydown");

  keyboardStream.subscribe({
    next: (event) => {
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
    },
  });

  return () => {
    const state = db.deref();

    const squareSize = 30;

    const scalePoint = (point: Point): Point => mul2([], point, [squareSize, squareSize]) as Point;

    const bodyChunkCCmp = (point: Point, isHead: boolean) => [
      "rect",
      { fill: isHead ? "red" : "black" },
      scalePoint(point),
      squareSize,
      squareSize,
    ];

    const foodCCmp = (point: Point) => [
      "circle",
      { fill: "rgb(43, 156, 212)" },
      add2([], scalePoint(point), [squareSize * 0.5, squareSize * 0.5]),
      squareSize * 0.5,
    ];

    const [width, height] = scalePoint(state.shape);

    return div({}, [
      canvasEl,
      { width, height, style: { border: "1px black solid" } },

      // food
      map((point) => foodCCmp(point), state.food),
      
      // snake
      mapIndexed((i, point) => bodyChunkCCmp(point, i === 0), state.snake),
    ]);
  };
};
