import { Game } from "../game";
import { endText } from "../text";
import { State } from "./state";

export class EndState extends State {
  constructor(game: Game) {
    super(game);
    this.game.head = [-1, 0];
    this.game.foods = [];
    this.setTextBody(endText);
  }

  run = (time: DOMHighResTimeStamp) => {
    this.drawGrid();
    this.drawBody();
  };
}
