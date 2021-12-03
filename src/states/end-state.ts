import { Game } from "../game";
import { State } from "./state";
import { Sequence, SequencePhase } from "../sequence";
import * as Constants from "../constants";

export class EndState extends State {
  sequence: Sequence;

  constructor(game: Game, currentTime: number) {
    super(game);
    const phases: SequencePhase[] = [
      new FadeOutBack(game, Constants.sequenceTime),
      new MoveHead(game, Constants.sequenceTime),
      new FadeInBack(game, Constants.sequenceTime),
    ];
    this.sequence = new Sequence(currentTime, phases);
  }

  drawSmileEyes = () => {
    const { context, head } = this.game;
    const { rowWidth, eyeColor } = Constants;

    context.save();
    context.fillStyle = eyeColor;

    context.translate(
      head[0] * rowWidth + rowWidth / 2,
      head[1] * rowWidth + rowWidth / 2
    );

    context.rotate(Math.PI);

    const measure = context.measureText("v");
    context.fillText(
      "v",
      -rowWidth / 4 - measure.width / 2,
      rowWidth / 4 + measure.width / 2
    );

    context.fillText(
      "v",
      rowWidth / 4 - measure.width / 2,
      rowWidth / 4 + measure.width / 2
    );

    context.restore();
  };

  run = (time: number) => {
    this.sequence.run(time);
    this.game.drawBody();
    this.game.drawHead();
    this.game.drawFood();
    this.drawSmileEyes();
  };
}

class FadeOutBack extends SequencePhase {
  run = (elapsed: number) => {
    this.game.bodyOpacity = 1 - elapsed;
    this.game.foodOpacity = 1 - elapsed;
  };
}

class MoveHead extends SequencePhase {
  run = (elapsed: number) => {
    this.game.headOpacity = 1 - elapsed;
  };
}

class FadeInBack extends SequencePhase {
  isReset = false;

  run = (elapsed: number) => {
    if (!this.isReset) {
      this.isReset = true;
      this.game.resetEnd();
    }
    this.game.bodyOpacity = elapsed;
  };
}
