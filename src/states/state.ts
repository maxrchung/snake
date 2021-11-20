import * as Constants from "../constants";
import { Game } from "../game";

export interface IState {
  onKeyDown: (e: KeyboardEvent) => void;
  run: (time: DOMHighResTimeStamp) => void;
}

export abstract class State implements IState {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onKeyDown = (e: KeyboardEvent) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  run = (time: DOMHighResTimeStamp) => {};
}
