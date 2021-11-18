import { PlayState } from "./states/playState";
import { State } from "./states/state";

export class Game {
  width = 900;
  lightGray = "rgb(200, 200, 200)";
  rows = 27;
  rowWidth = this.width / this.rows;

  moveTime = 75;
  previousMoveTime = 0;

  fontSize = 14;
  font = `${this.fontSize}px sans-serif`;
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
    this.canvas.width = this.width;
    this.canvas.height = this.width;

    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.context.font = this.font;

    this.state = new PlayState(this);
  }
}
