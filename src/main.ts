// TODO:
// Handle win
// Balance game?
// Deploy
// Add some eyes
// Add timer when death
// States
// Blow up tail
// Screen shake

import { Game } from "./game";

const game = new Game();

document.addEventListener("keydown", game.state.onKeyDown);

const gameLoop = (time: DOMHighResTimeStamp) => {
  game.context.clearRect(0, 0, game.width, game.width);
  game.state.run(time);
  window.requestAnimationFrame(gameLoop);
};

window.requestAnimationFrame(gameLoop);
