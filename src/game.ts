import * as Constants from "./constants";
import { PlayState } from "./states/playState";
import { State } from "./states/state";

export class Game {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  state: State;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.canvas.width = Constants.width;
    this.canvas.height = Constants.width;

    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.context.font = Constants.font;

    this.state = new PlayState(this);

    document.addEventListener("keydown", this.state.onKeyDown);
  }

  run = (time: DOMHighResTimeStamp) => {
    this.context.clearRect(0, 0, Constants.width, Constants.width);
    this.state.run(time);
  };
}
