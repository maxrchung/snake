import { Game } from "../game";
import { State } from "./state";
import { EndState } from "./end-state";
import * as Constants from "../constants";
import { ResettingState } from "./resetting-state";

export class PlayState extends State {
  constructor(game: Game) {
    super(game);
  }

  setDirection = (x: number, y: number) => {
    const { bodies: body, head } = this.game;

    if (body.length !== 0) {
      const nextPosition = [head[0] + x, head[1] + y];
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
      this.game.head[0] = 0;
    } else if (this.game.head[0] < 0) {
      this.game.head[0] = Constants.rows - 1;
    }

    if (this.game.head[1] >= Constants.rows) {
      this.game.head[1] = 0;
    } else if (this.game.head[1] < 0) {
      this.game.head[1] = Constants.rows - 1;
    }

    for (const body of this.game.bodies) {
      if (this.game.head[0] === body[0] && this.game.head[1] === body[1]) {
        this.game.state = new ResettingState(this.game, time);
        return;
      }
    }
  };

  updateFood = () => {
    for (const food of this.game.foods) {
      if (this.game.head[0] !== food[0] || this.game.head[1] !== food[1]) {
        continue;
      }

      this.game.bodies.pop();

      if (this.game.bodies.length == 0) {
        this.game.state = new EndState(this.game);
        return;
      }

      const newFoods = this.game.foods.filter(
        (element) => element[0] !== food[0] || element[1] !== food[1]
      );
      const newFood = this.game.getFoodPosition();
      newFoods.push(newFood);
      this.game.foods = newFoods;

      return;
    }
  };

  drawPlayEyes = () => {
    const { context, head, direction } = this.game;
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

  run = (time: number) => {
    this.updateSnake(time);
    this.updateFood();
    this.game.drawHead();
    this.drawPlayEyes();
    this.game.drawBody();
    this.game.drawFood();
  };
}
