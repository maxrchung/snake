// Flair:
// Add transition when death
// Some way to indicate length is lowering
// Screen shake

import * as Constants from "./constants";
import { Game } from "./game";

const game = new Game();

document.addEventListener("keydown", game.state.onKeyDown);

const run = (time: DOMHighResTimeStamp) => {
  game.context.clearRect(0, 0, Constants.width, Constants.width);
  game.drawGrid();
  game.state.run(time);
  window.requestAnimationFrame(run);
};

window.requestAnimationFrame(run);
