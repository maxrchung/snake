import { font, width } from "./constants";
import { PlayState } from "./states/playState";
import { State } from "./states/state";

export class Game {
  // These values need to be here so that they are tracked between states
  previousMoveTime = 0;

  text = "";

  direction: number[] = [];
  head: number[] = [];
  body: number[][] = [];
  food: number[] = [];

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  state: State;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.canvas.width = width;
    this.canvas.height = width;

    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.context.font = font;

    this.state = new PlayState(this);
  }
}
