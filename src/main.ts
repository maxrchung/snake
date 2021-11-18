// TODO:
// Handle win
// Balance game?
// Deploy
// Add some eyes
// Add timer when death
// States
// Blow up tail
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
