import * as Constants from "./constants";
import { PlayState } from "./states/play-state";
import { ResetState } from "./states/reset-state";
import { IState, State } from "./states/state";

export class Game implements IState {
  // Keeping these values here they are tracked between states
  previousMoveTime = 0;

  text = "";

  direction: number[] = [];
  head: number[] = [];
  bodies: number[][] = [];
  foods: number[][] = [];

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  state: State;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.canvas.width = Constants.width;
    this.canvas.height = Constants.width;

    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.context.font = Constants.font;

    this.state = new ResetState(this, 0);
  }

  onKeyDown = () => this.state.onKeyDown;

  run = () => this.state.run;

  setTextBody = (text: string) => {
    const maxLength = Constants.rows - this.head[0] - 1;
    const textRows: string[][] = [];
    let textRow: string[] = [];
    let currLength = 0;

    const textSplit = text.split(" ");
    for (const word of textSplit) {
      const spaces = textRow.length;
      if (currLength + spaces + word.length > maxLength) {
        textRows.push(textRow);
        textRow = [word];
        currLength = word.length;
      } else {
        textRow.push(word);
        currLength += word.length;
      }
    }
    textRows.push(textRow);

    const joinedRows = textRows.map((textRow) => textRow.join(" "));

    const paddedRows = joinedRows.map((joinedRow) =>
      joinedRow.length === maxLength
        ? joinedRow
        : joinedRow + " ".repeat(maxLength - joinedRow.length)
    );

    const reversedRows = paddedRows.map((paddedRow, index) =>
      index % 2 === 0 ? paddedRow : paddedRow.split("").reverse().join("")
    );

    this.text = reversedRows.join("");

    let currentHeight = this.head[1];
    let isGoingRight = true;
    this.bodies.push([this.head[0] + 1, currentHeight]);
    for (let i = 1; i < this.text.length; ++i) {
      const index = i % maxLength;
      if (index === 0) {
        ++currentHeight;
        isGoingRight = !isGoingRight;
      }

      const x = isGoingRight
        ? this.head[0] + 1 + index
        : this.head[0] + maxLength - index;
      this.bodies.push([x, currentHeight]);
    }
  };

  drawGrid = () => {
    const { context } = this;
    context.beginPath();
    for (let i = 0; i <= Constants.width; i += Constants.rowWidth) {
      context.moveTo(i, 0);
      context.lineTo(i, Constants.width);
      context.moveTo(0, i);
      context.lineTo(Constants.width, i);
    }
    context.closePath();
    context.save();
    context.strokeStyle = Constants.gridColor;
    context.stroke();
    context.restore();
  };

  drawBody = () => {
    const { context, text, bodies: body } = this;

    const textIndex = text.length - body.length;
    body.map((food, index) => {
      context.strokeRect(
        food[0] * Constants.rowWidth,
        food[1] * Constants.rowWidth,
        Constants.rowWidth,
        Constants.rowWidth
      );
      if (index < text.length) {
        const character = text[textIndex + index];
        const measure = context.measureText(character);
        context.fillText(
          character,
          food[0] * Constants.rowWidth +
            Constants.rowWidth / 2 -
            measure.width / 2,
          food[1] * Constants.rowWidth +
            Constants.rowWidth / 2 +
            Constants.fontSize / 2
        );
      }
    });
  };
}
