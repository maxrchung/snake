import { Game } from "../game";
import { State } from "./state";
import { PlayState } from "./play-state";
import { Sequence, SequencePhase } from "../sequence";
import * as Constants from "../constants";

export class ResettingState extends State {
  sequence: Sequence;

  constructor(game: Game, currentTime: number) {
    super(game);
    const phases: SequencePhase[] = [
      new FadeOutBack(game, 1000),
      new MoveHead(game, 1000),
      new FadeInBack(game, 1000),
    ];
    this.sequence = new Sequence(currentTime, phases);
  }

  drawXEyes = () => {
    const { context, head, direction } = this.game;
    const { rowWidth, eyeColor } = Constants;

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

    const measure = context.measureText("x");
    context.fillText(
      "x",
      -rowWidth / 4 - measure.width / 2,
      rowWidth / 4 + measure.width / 2
    );

    context.fillText(
      "x",
      rowWidth / 4 - measure.width / 2,
      rowWidth / 4 + measure.width / 2
    );

    context.restore();
  };

  run = (time: number) => {
    if (this.sequence.isFinished) {
      this.game.state = new PlayState(this.game);
    } else {
      this.sequence.run(time);
    }

    this.game.drawBody();
    this.game.drawHead();
    this.drawXEyes();
    this.game.drawFood();
  };
}

class FadeOutBack extends SequencePhase {
  run = (elapsed: number) => {
    this.game.backOpacity = 1 - elapsed;
  };
}

class MoveHead extends SequencePhase {
  startPosition: number[];

  constructor(game: Game, duration: number) {
    super(game, duration);
    this.startPosition = this.game.head;
  }

  run = (elapsed: number) => {
    const x = this.startPosition[0] * (1 - elapsed);
    const y = this.startPosition[1] * (1 - elapsed);
    this.game.head = [x, y];
  };
}

class FadeInBack extends SequencePhase {
  isReset = false;

  run = (elapsed: number) => {
    if (!this.isReset) {
      this.isReset = true;
      this.game.resetPlay();
    }
    this.game.backOpacity = elapsed;
  };
}
