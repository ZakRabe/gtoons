import { Conditional } from './Conditional';
import { Modifier } from './Modifer';
import Card from './Card';

//Add check for different conditional combinations?
export default class Power {
  id: number;
  conditions: Conditional[];
  modifiers: Modifier[];
  constructor(_conditions: Conditional[], _modifiers: Modifier[]) {
    this.conditions = [..._conditions];
    this.modifiers = [..._modifiers];
  }

  check(board: (Card | null)[]): Boolean {
    var d = this.conditions.map(condition => {
      condition.check(board);
    });

    console.log(d);
    return true;
  }
}
