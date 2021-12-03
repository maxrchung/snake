/* eslint-disable @typescript-eslint/no-empty-function */

import { Easing } from "./easing";
import { Game } from "./game";

/* eslint-disable @typescript-eslint/no-unused-vars */
export abstract class SequencePhase {
  game: Game;
  duration: number;
  constructor(game: Game, duration: number) {
    this.game = game;
    this.duration = duration;
  }
  run = (time: number) => {};
}

interface ProcessPhase {
  startTime: number;
  endTime: number;
  sequencePhase: SequencePhase;
}

export class Sequence {
  startTime: number;
  endTime: number;
  phases: ProcessPhase[] = [];
  currentIndex = 0;
  isFinished = false;

  constructor(startTime: number, sequencePhases: SequencePhase[]) {
    this.startTime = startTime;
    const totalTime = sequencePhases.reduce(
      (value, phase) => value + phase.duration,
      0
    );
    this.endTime = this.startTime + totalTime;

    let phaseTime = startTime;
    sequencePhases.map((sequencePhase) => {
      this.phases.push({
        startTime: phaseTime,
        endTime: phaseTime + sequencePhase.duration,
        sequencePhase: sequencePhase,
      });
      phaseTime += sequencePhase.duration;
    });

    console.log(sequencePhases);
    console.log(this.phases);
  }

  run = (time: number) => {
    if (this.isFinished) {
      return;
    }

    let currentPhase = this.phases[this.currentIndex];
    while (time > this.phases[this.currentIndex].endTime) {
      // Ensure end is always ran
      currentPhase.sequencePhase.run(1);
      if (++this.currentIndex === this.phases.length) {
        this.isFinished = true;
        return;
      }
    }

    currentPhase = this.phases[this.currentIndex];
    const elapsedTime = time - currentPhase.startTime;
    const elapsed = Easing.inQuad(
      elapsedTime / currentPhase.sequencePhase.duration
    );
    currentPhase.sequencePhase.run(elapsed);
  };
}
