// Flair:
// X_X eyes for death
// Add transition when death
// Some way to indicate length is lowering
// Screen shake

console.log(process.env.START_TEXT);
console.log(process.env.END_TEXT);

import * as Constants from "./constants";
import { Game } from "./game";

const game = new Game();

document.addEventListener("keydown", game.state.onKeyDown);

const run = (time: DOMHighResTimeStamp) => {
  game.context.clearRect(0, 0, Constants.width, Constants.width);
  game.state.run(time);
  window.requestAnimationFrame(run);
};

window.requestAnimationFrame(run);
