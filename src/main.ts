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

const run = (time: DOMHighResTimeStamp) => {
  game.run(time);
  window.requestAnimationFrame(run);
};

window.requestAnimationFrame(run);
