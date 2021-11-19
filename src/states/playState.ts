import { Game } from "../game";
import { startText } from "../text";
import { State } from "./state";
import { EndState } from "./endState";
import * as Constants from "../constants";
import times from "lodash-es/times";

export class PlayState extends State {
  constructor(game: Game) {
    super(game);
    this.reset();
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

  reset = () => {
    this.game.direction = [0, 0];
    this.game.head = [0, 0];
    this.game.bodies = [];
    this.setTextBody(startText);
    this.game.foods = [];
    times(20, () => this.game.foods.push(this.getFoodPosition()));
  };

  getFoodPosition = () => {
    let position = this.getRandomPosition();
    while (this.isExistingPosition(position)) {
      position = this.getRandomPosition();
    }
    return position;
  };

  getRandomPosition = () => [
    Math.floor(Math.random() * Constants.rows),
    Math.floor(Math.random() * Constants.rows),
  ];

  isExistingPosition = (position: number[]) => {
    const isFoodPosition = this.game.foods.find(
      (element) => element[0] === position[0] && element[1] === position[1]
    );
    if (isFoodPosition) {
      return true;
    }

    if (
      position[0] === this.game.head[0] &&
      position[1] === this.game.head[1]
    ) {
      return true;
    }

    for (const body of this.game.bodies) {
      if (position[0] === body[0] && position[1] === body[1]) {
        return true;
      }
    }

    return false;
  };

  updateSnake = (time: number) => {
    if (time - this.game.previousMoveTime <= Constants.moveTime) {
      return;
    }

    this.updateBody();
    this.updateHead();
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

  updateHead = () => {
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
        this.reset();
        return;
      }
    }
  };

  updateFood = () => {
    for (let food of this.game.foods) {
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
      const newFood = this.getFoodPosition();
      newFoods.push(newFood);
      this.game.foods = newFoods;

      return;
    }
  };

  drawHead = () =>
    this.game.context.fillRect(
      this.game.head[0] * Constants.rowWidth,
      this.game.head[1] * Constants.rowWidth,
      Constants.rowWidth,
      Constants.rowWidth
    );

  drawFood = () =>
    this.game.foods.forEach((food) =>
      this.game.context.fillRect(
        food[0] * Constants.rowWidth + Constants.rowWidth * 0.25,
        food[1] * Constants.rowWidth + Constants.rowWidth * 0.25,
        Constants.rowWidth * 0.5,
        Constants.rowWidth * 0.5
      )
    );

  run = (time: DOMHighResTimeStamp) => {
    this.updateSnake(time);
    this.updateFood();
    this.drawGrid();
    this.drawHead();
    this.drawBody();
    this.drawFood();
  };
}
