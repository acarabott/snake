import { defAtom } from "@thi.ng/atom";
import { start } from "@thi.ng/hdom";
import { State } from "./api";
import { defMainCmp } from "./components/mainCmp";

const app = () => {
  const db = defAtom<State>({});

  const mainCmp = defMainCmp(db);
  return () => {
    return mainCmp();
  };
};

start(app(), { root: document.body });
