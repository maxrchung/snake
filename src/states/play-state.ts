import { Game } from "../game";
import { State } from "./state";
import * as Constants from "../constants";
import { ResetState } from "./reset-state";
import { EndState } from "./end-state";
import { Sequence, SequencePhase } from "../sequence";

export class PlayState extends State {
  constructor(game: Game) {
    super(game);
  }

  setDirection = (x: number, y: number) => {
    const { bodies: body, head } = this.game;

    if (body.length !== 0) {
      const nextPosition = [head[0] + x, head[1] + y];

      if (nextPosition[0] < 0) {
        nextPosition[0] = Constants.rows - 1;
      } else if (nextPosition[0] >= Constants.rows) {
        nextPosition[0] = 0;
      }

      if (nextPosition[1] < 0) {
        nextPosition[1] = Constants.rows - 1;
      } else if (nextPosition[1] >= Constants.rows) {
        nextPosition[1] = 0;
      }

      if (nextPosition[0] === body[0][0] && nextPosition[1] === body[0][1]) {
        return;
      }
    }

    this.game.direction = [x, y];
  };

  onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        this.setDirection(0, -1);
        break;
      case "ArrowLeft":
      case "KeyA":
        this.setDirection(-1, 0);
        break;
      case "ArrowDown":
      case "KeyS":
        this.setDirection(0, 1);
        break;
      case "ArrowRight":
      case "KeyD":
        this.setDirection(1, 0);
        break;
    }
  };

  updateSnake = (time: number) => {
    if (time - this.game.previousMoveTime <= Constants.moveTime) {
      return;
    }

    this.updateBody();
    this.updateHead(time);
    this.game.previousMoveTime = time;
  };

  updateBody = () => {
    if (this.game.direction[0] === 0 && this.game.direction[1] === 0) {
      return;
    }

    for (let i = this.game.bodies.length - 1; i >= 0; --i) {
      if (i === 0) {
        this.game.bodies[0][0] = this.game.head[0];
        this.game.bodies[0][1] = this.game.head[1];
        break;
      }

      this.game.bodies[i][0] = this.game.bodies[i - 1][0];
      this.game.bodies[i][1] = this.game.bodies[i - 1][1];
    }
  };

  updateHead = (time: number) => {
    this.game.head[0] += this.game.direction[0];
    this.game.head[1] += this.game.direction[1];

    if (this.game.head[0] >= Constants.rows) {
      this.game.state = new ResetState(this.game, time);
      return;
    } else if (this.game.head[0] < 0) {
      this.game.state = new ResetState(this.game, time);
      return;
    }

    if (this.game.head[1] >= Constants.rows) {
      this.game.state = new ResetState(this.game, time);
      return;
    } else if (this.game.head[1] < 0) {
      this.game.state = new ResetState(this.game, time);
      return;
    }

    for (const body of this.game.bodies) {
      if (this.game.head[0] === body[0] && this.game.head[1] === body[1]) {
        this.game.state = new ResetState(this.game, time);
        return;
      }
    }
  };

  updateFood = (time: number) => {
    for (const food of this.game.foods) {
      if (this.game.head[0] !== food[0] || this.game.head[1] !== food[1]) {
        continue;
      }

      if (this.game.bodies.length === 0) {
        this.game.state = new EndState(this.game, time);
        return;
      }

      const lastBody = this.game.bodies[this.game.bodies.length - 1];

      this.game.eatSequences.push(
        new Sequence(time, [
          new FadeOutBody(
            this.game,
            Constants.sequenceTime,
            lastBody[0],
            lastBody[1],
            this.game.text[this.game.bodies.length - 1]
          ),
        ])
      );

      this.game.bodies.pop();

      const newFoods = this.game.foods.filter(
        (element) => element[0] !== food[0] || element[1] !== food[1]
      );
      const newFood = this.game.getFoodPosition();
      newFoods.push(newFood);
      this.game.foods = newFoods;

      return;
    }
  };

  run = (time: number) => {
    this.updateSnake(time);
    this.updateFood(time);
    this.game.drawHead();
    this.game.drawBody();
    this.game.drawFood();
    this.game.drawEatSequences(time);
    this.game.drawPlayEyes();
  };
}

class FadeOutBody extends SequencePhase {
  x: number;
  y: number;
  character: string;

  constructor(
    game: Game,
    duration: number,
    x: number,
    y: number,
    character: string
  ) {
    super(game, duration);
    this.x = x;
    this.y = y;
    this.character = character;
  }

  run = (elapsed: number) => {
    const { context } = this.game;
    context.save();
    context.globalAlpha = 1 - elapsed;

    context.strokeRect(
      this.x * Constants.rowWidth,
      this.y * Constants.rowWidth,
      Constants.rowWidth,
      Constants.rowWidth
    );

    const measure = context.measureText(this.character);
    context.fillText(
      this.character,
      this.x * Constants.rowWidth + Constants.rowWidth / 2 - measure.width / 2,
      this.y * Constants.rowWidth +
        Constants.rowWidth / 2 +
        Constants.fontSize / 2
    );

    context.restore();
  };
}
