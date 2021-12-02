interface SequencePhase {
  duration: number;
  run: (time: DOMHighResTimeStamp) => void;
}

interface ProcessPhase {
  startTime: number;
  endTime: number;
  run: (time: DOMHighResTimeStamp) => void;
}

export class Sequence {
  startTime: number;
  endTime: number;
  phases: ProcessPhase[] = [];
  currentIndex = 0;
  isFinished = false;

  constructor(startTime: DOMHighResTimeStamp, sequencePhases: SequencePhase[]) {
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
        run: sequencePhase.run,
      });
      phaseTime += sequencePhase.duration;
    });

    console.log(sequencePhases);
    console.log(this.phases);
  }

  run = (time: DOMHighResTimeStamp) => {
    if (this.isFinished) {
      return;
    }

    while (time > this.phases[this.currentIndex].endTime) {
      if (++this.currentIndex === this.phases.length) {
        this.isFinished = true;
        return;
      }
    }

    const elapsedTime = time - this.phases[this.currentIndex].startTime;
    this.phases[this.currentIndex].run(elapsedTime);
  };
}
