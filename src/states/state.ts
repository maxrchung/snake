import * as Constants from "../constants";
import { Game } from "../game";

export class State {
  game: Game;

  previousMoveTime = 0;

  text = "";

  direction: number[] = [];
  head: number[] = [];
  body: number[][] = [];
  food: number[] = [];

  constructor(game: Game) {
    this.game = game;
  }

  onKeyDown = (e: KeyboardEvent) => {};

  run = (time: DOMHighResTimeStamp) => {};

  setTextBody = (text: string) => {
    const maxLength = Constants.rows - this.head[0] - 1;
    const textRows: string[][] = [];
    let textRow: string[] = [];
    let currLength = 0;

    const textSplit = text.split(" ");
    for (const word of textSplit) {
      const spaces = textRow.length;
      if (currLength + spaces + word.length >= maxLength) {
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
    this.body = [[this.head[0] + 1, currentHeight]];
    for (let i = 1; i < this.text.length; ++i) {
      const index = i % maxLength;
      if (index === 0) {
        ++currentHeight;
        isGoingRight = !isGoingRight;
      }

      const x = isGoingRight
        ? this.head[0] + 1 + index
        : this.head[0] + maxLength - index;
      this.body.push([x, currentHeight]);
    }
  };

  drawGrid = () => {
    const { context } = this.game;
    context.beginPath();
    for (let i = 0; i <= Constants.width; i += Constants.rowWidth) {
      context.moveTo(i, 0);
      context.lineTo(i, Constants.width);
      context.moveTo(0, i);
      context.lineTo(Constants.width, i);
    }
    context.closePath();
    context.save();
    context.strokeStyle = Constants.lightGray;
    context.stroke();
    context.restore();
  };

  drawBody = () => {
    const textIndex = this.text.length - this.body.length;
    this.body.map((food, index) => {
      this.game.context.strokeRect(
        food[0] * Constants.rowWidth,
        food[1] * Constants.rowWidth,
        Constants.rowWidth,
        Constants.rowWidth
      );
      if (index < this.text.length) {
        const character = this.text[textIndex + index];
        const measure = this.game.context.measureText(character);
        this.game.context.fillText(
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
