// TODO:
// Deploy

// Balance game some more?

// Flair:
// Add some eyes
// X_X eyes for death
// Add transition when death
// Some way to indicate length is lowering
// Screen shake

import * as Constants from "./constants";
import { Game } from "./game";

const game = new Game();

document.addEventListener("keydown", game.state.onKeyDown);

const gameLoop = (time: DOMHighResTimeStamp) => {
  game.context.clearRect(0, 0, Constants.width, Constants.width);
  game.state.run(time);
  window.requestAnimationFrame(gameLoop);
};

window.requestAnimationFrame(gameLoop);
