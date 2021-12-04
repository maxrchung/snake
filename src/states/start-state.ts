import { Game } from "../game";
import { State } from "./state";
import { Sequence, SequencePhase } from "../sequence";
import * as Constants from "../constants";
import { PlayState } from "./play-state";

export class StartState extends State {
  sequence: Sequence;

  constructor(game: Game, currentTime: number) {
    super(game);
    const phases: SequencePhase[] = [
      new FadeInHead(game, Constants.sequenceTime),
      new FadeInFood(game, Constants.sequenceTime),
      new FadeInBody(game, Constants.sequenceTime),
    ];
    this.sequence = new Sequence(currentTime, phases);
  }

  run = (time: number) => {
    if (this.sequence.isFinished) {
      this.game.state = new PlayState(this.game);
    } else {
      this.sequence.run(time);
    }

    this.game.drawBody();
    this.game.drawHead();
    this.game.drawFood();
    this.game.drawPlayEyes();
  };
}

class FadeInHead extends SequencePhase {
  run = (elapsed: number) => {
    this.game.headOpacity = elapsed;
  };
}

class FadeInFood extends SequencePhase {
  run = (elapsed: number) => {
    this.game.foodOpacity = elapsed;
  };
}

class FadeInBody extends SequencePhase {
  run = (elapsed: number) => {
    this.game.bodyOpacity = elapsed;
  };
}
