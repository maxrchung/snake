import { Game } from "../game";
import { endText } from "../text";
import { State } from "./state";

export class EndState extends State {
  constructor(game: Game) {
    super(game);
    this.head = [-1, 0];
    this.setTextBody(endText);
  }

  run = () => {
    this.drawGrid();
    this.drawBody();
  };
}
