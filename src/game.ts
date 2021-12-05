import times from "lodash-es/times";
import * as Constants from "./constants";
import { Sequence } from "./sequence";
import { StartState } from "./states/start-state";
import { IState, State } from "./states/state";

export class Game implements IState {
  // Keeping these values here they are tracked between states
  previousMoveTime = 0;

  text = "";

  direction: number[] = [];
  head: number[] = [];
  bodies: number[][] = [];
  foods: number[][] = [];
  eatSequences: Sequence[] = [];
  headOpacity = 0;
  bodyOpacity = 0;
  foodOpacity = 0;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  state: State;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.canvas.width = Constants.width;
    this.canvas.height = Constants.width;

    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.context.font = Constants.font;

    this.state = new StartState(this, 0);
    this.resetPlay();
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

  getRandomPosition = () => [
    Math.floor(Math.random() * Constants.rows),
    Math.floor(Math.random() * Constants.rows),
  ];

  isExistingPosition = (position: number[]) => {
    const isFoodPosition = this.foods.find(
      (element) => element[0] === position[0] && element[1] === position[1]
    );
    if (isFoodPosition) {
      return true;
    }

    if (position[0] === this.head[0] && position[1] === this.head[1]) {
      return true;
    }

    for (const body of this.bodies) {
      if (position[0] === body[0] && position[1] === body[1]) {
        return true;
      }
    }

    return false;
  };

  getFoodPosition = () => {
    let position = this.getRandomPosition();
    while (this.isExistingPosition(position)) {
      position = this.getRandomPosition();
    }
    return position;
  };

  resetPlay = () => {
    this.direction = [0, 0];
    this.head = [0, 0];
    this.bodies = [];
    this.setTextBody(Constants.startText);
    this.foods = [];
    times(1, () => this.foods.push(this.getFoodPosition()));
    this.eatSequences = [];
  };

  resetEnd = () => {
    this.head = [-1, 0];
    this.foods = [];
    this.bodies = [];
    this.setTextBody(Constants.endText);
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

  drawHead = () => {
    const { context, headOpacity } = this;
    context.save();
    context.globalAlpha = headOpacity;
    context.fillRect(
      this.head[0] * Constants.rowWidth,
      this.head[1] * Constants.rowWidth,
      Constants.rowWidth,
      Constants.rowWidth
    );
    context.restore();
  };

  drawBody = () => {
    const { context, text, bodies } = this;

    context.save();
    context.globalAlpha = this.bodyOpacity;
    bodies.map((body, index) => {
      context.strokeRect(
        body[0] * Constants.rowWidth,
        body[1] * Constants.rowWidth,
        Constants.rowWidth,
        Constants.rowWidth
      );
      if (index < text.length) {
        const character = text[index];
        const measure = context.measureText(character);
        context.fillText(
          character,
          body[0] * Constants.rowWidth +
            Constants.rowWidth / 2 -
            measure.width / 2,
          body[1] * Constants.rowWidth +
            Constants.rowWidth / 2 +
            Constants.fontSize / 2
        );
      }
    });
    context.restore();
  };

  drawFood = () => {
    const { context, foods } = this;
    context.save();
    context.globalAlpha = this.foodOpacity;
    foods.forEach((food) =>
      context.fillRect(
        food[0] * Constants.rowWidth + Constants.rowWidth * 0.25,
        food[1] * Constants.rowWidth + Constants.rowWidth * 0.25,
        Constants.rowWidth * 0.5,
        Constants.rowWidth * 0.5
      )
    );
    context.restore();
  };

  drawEatSequences = (time: number) => {
    for (const sequence of this.eatSequences) {
      sequence.run(time);
    }
  };

  drawPlayEyes = () => {
    const { context, head, direction } = this;
    const { rowWidth, eyeWidth, eyeColor } = Constants;

    context.save();
    context.fillStyle = eyeColor;

    context.translate(
      head[0] * rowWidth + rowWidth / 2,
      head[1] * rowWidth + rowWidth / 2
    );

    if (
      (direction[0] === 0 && direction[1] === 0) ||
      (direction[0] === 0 && direction[1] === 1)
    ) {
      context.rotate(0);
    } else if (direction[0] === -1 && direction[1] === 0) {
      context.rotate(Math.PI / 2);
    } else if (direction[0] === 0 && direction[1] === -1) {
      context.rotate(Math.PI);
    } else if (direction[0] === 1 && direction[1] === 0) {
      context.rotate(-Math.PI / 2);
    }

    context.fillRect(
      -rowWidth / 4 - eyeWidth / 2,
      rowWidth / 4 - eyeWidth / 2,
      eyeWidth,
      eyeWidth
    );
    context.fillRect(
      rowWidth / 4 - eyeWidth / 2,
      rowWidth / 4 - eyeWidth / 2,
      eyeWidth,
      eyeWidth
    );

    context.restore();
  };
}
