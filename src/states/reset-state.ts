import { Game } from "../game";
import { State } from "./state";
import { PlayState } from "./play-state";
import { Sequence } from "../sequence";

export class ResetState extends State {
  sequence: Sequence;

  constructor(game: Game, currentTime: DOMHighResTimeStamp) {
    super(game);
    const phases = [
      { duration: 1000, run: () => console.log("phase1") },
      { duration: 1000, run: () => console.log("phase2") },
      { duration: 1000, run: () => console.log("phase3") },
      { duration: 1000, run: () => console.log("phase4") },
      { duration: 1000, run: () => console.log("phase5") },
    ];
    this.sequence = new Sequence(currentTime, phases);
  }

  run = (time: DOMHighResTimeStamp) => {
    if (this.sequence.isFinished) {
      this.game.state = new PlayState(this.game);
    } else {
      this.sequence.run(time);
    }
  };
}
