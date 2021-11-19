import { Game } from "../game";
import { endText } from "../text";
import { State } from "./state";

export class EndState extends State {
  constructor(game: Game) {
    super(game);
    this.setTextBody(endText);
  }

  run = (time: DOMHighResTimeStamp) => {
    this.drawGrid();
    this.drawBody();
  };
}
