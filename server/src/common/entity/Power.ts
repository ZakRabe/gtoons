import { Conditional } from './Conditional';
import { Modifier } from './Modifer';
import Card from './Card';

//Add check for different conditional combinations?
export default class Power {
  id: number;
  type: string;
  conditionRestriction: string;
  target: string;
  targetType: string;
  targetConditions: any[];
  conditionType: string;
  conditions: any[];
  modifiers: any[];

  constructor(other: any) {
    if (other) {
      this.id = other.id;
      this.type = other.type;
      this.conditionRestriction = other.conditionRestriction;
      this.target = other.target;
      this.targetType = other.targetType;
      this.targetConditions = other.targetConditions;
      this.conditionType = other.conditionType;
      this.conditions = other.conditions;
      this.modifiers = other.modifiers;
    }
  }

  check(board: (Card | null)[]): Boolean {
    var d = this.conditions.map((condition) => {
      condition.check(board);
    });

    console.log(d);
    return true;
  }
}
