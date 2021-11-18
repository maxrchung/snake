import { Game } from "../game";
import { startText } from "../text";
import { State } from "./state";
import { EndState } from "./endState";

export class PlayState extends State {
  constructor(game: Game) {
    super(game);
    this.reset();
  }

  setDirection = (x: number, y: number) => {
    const { body, head } = this.game;

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
    this.game.head = [1, 1];
    this.game.body = [];
    this.setTextBody(startText);
    this.game.food = this.getFoodPosition();
  };

  getFoodPosition = () => {
    let position = this.getRandomPosition();
    while (this.isExistingPosition(position)) {
      position = this.getRandomPosition();
    }
    return position;
  };

  getRandomPosition = () => [
    Math.floor(Math.random() * this.game.rows),
    Math.floor(Math.random() * this.game.rows),
  ];

  isExistingPosition = (position: number[]) => {
    const { food, head, body } = this.game;

    if (food && position[0] === food[0] && position[1] === food[1]) {
      return true;
    }

    if (position[0] === head[0] && position[1] === head[1]) {
      return true;
    }

    for (const bodyPart of body) {
      if (position[0] === bodyPart[0] && position[1] === bodyPart[1]) {
        return true;
      }
    }

    return false;
  };

  updateSnake = (time: number) => {
    if (time - this.game.previousMoveTime <= this.game.moveTime) {
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

    for (let i = this.game.body.length - 1; i >= 0; --i) {
      if (i === 0) {
        this.game.body[0][0] = this.game.head[0];
        this.game.body[0][1] = this.game.head[1];
        break;
      }

      this.game.body[i][0] = this.game.body[i - 1][0];
      this.game.body[i][1] = this.game.body[i - 1][1];
    }
  };

  updateHead = () => {
    this.game.head[0] += this.game.direction[0];
    this.game.head[1] += this.game.direction[1];

    if (
      this.game.head[0] >= this.game.rows ||
      this.game.head[0] < 0 ||
      this.game.head[1] >= this.game.rows ||
      this.game.head[1] < 0
    ) {
      this.reset();
      return;
    }

    for (const bodyPart of this.game.body) {
      if (
        this.game.head[0] === bodyPart[0] &&
        this.game.head[1] === bodyPart[1]
      ) {
        this.reset();
        return;
      }
    }
  };

  updateFood = () => {
    if (
      this.game.head[0] !== this.game.food[0] ||
      this.game.head[1] !== this.game.food[1]
    ) {
      return;
    }

    this.game.body.pop();

    if (this.game.body.length == 0) {
      this.game.state = new EndState(this.game);
      return;
    }

    const newFood = this.getFoodPosition();
    this.game.food = newFood;
  };

  drawHead = () => {
    const { context, head, rowWidth } = this.game;
    context.fillRect(
      head[0] * rowWidth,
      head[1] * rowWidth,
      rowWidth,
      rowWidth
    );
  };

  drawFood = () => {
    const { context, food, rowWidth } = this.game;

    context.fillRect(
      food[0] * rowWidth + rowWidth * 0.25,
      food[1] * rowWidth + rowWidth * 0.25,
      rowWidth * 0.5,
      rowWidth * 0.5
    );
  };

  run = (time: DOMHighResTimeStamp) => {
    this.updateSnake(time);
    this.updateFood();
    this.drawGrid();
    this.drawHead();
    this.drawBody();
    this.drawFood();
  };
}
