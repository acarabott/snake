import { div } from "@thi.ng/hiccup-html/blocks";
import { DB } from "../api";

export const defMainCmp = (db: DB) => {

  return () =>
    div(
      {},
      "Hello World"
    );
};
