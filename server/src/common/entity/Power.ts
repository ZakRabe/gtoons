import { Conditional } from './Conditional';
import { Modifier } from './Modifer';
import Card from './Card';

//Add check for different conditional combinations?
export default class Effect {
  id: number;
  conditions: Conditional[];
  modifiers: Modifier[];
  constructor(_conditions: Conditional[], _modifiers: Modifier[]) {
    this.conditions = [..._conditions];
    this.modifiers = [..._modifiers];
  }

  check = (board: (Card | null)[]): Boolean => {
    this.conditions.map(condition => {
      condition.check(board);
    });
    return true;
  };
}
