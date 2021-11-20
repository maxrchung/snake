import { Game } from "../game";
import { State } from "./state";
import * as Constants from "../constants";

export class EndState extends State {
  constructor(game: Game) {
    super(game);
    this.game.head = [-1, 0];
    this.game.foods = [];
    this.game.setTextBody(Constants.startText);
  }

  run = (time: DOMHighResTimeStamp) => {
    this.game.drawGrid();
    this.game.drawBody();
  };
}
