/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

  onKeyDown = (e: KeyboardEvent) => {};

  run = (time: DOMHighResTimeStamp) => {};
}
