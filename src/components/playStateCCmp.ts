import { PlayState } from "../api";

export const playStateCCmp = (playState: PlayState, width: number, height: number) => {
  if (playState === "playing") {
    return null;
  }

  const { msg, fill } = {
    win: { msg: "You Win!", fill: "rgba(43, 212, 156, 0.8)" },
    lose: { msg: "Game over, it's just game over!", fill: "rgba(0,0,0,0.4)" },
  }[playState];
  
  return [
    ["rect", { fill }, [0, 0], width, height],
    [
      "text",
      {
        fill: "rgb(0, 0, 0)",
        baseline: "middle",
        align: "center",
        font: `${(height * 0.1) | 0}px sans-serif `,
      },
      [width * 0.5, height * 0.5],
      msg,
    ],
  ];
};
