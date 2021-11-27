import { Conditional } from './Conditional';
import { Modifier } from './Modifer';
import Card from './Card';
import Condition from './Condition';

//Add check for different conditional combinations?
export default class Power {
  type: 'SINGLE' | 'FOR_EACH';
  conditionRestriction:
    | 'NONE'
    | 'ADJACENT'
    | 'OPPOSING'
    | 'NEIGHBOR'
    | 'OPPONENT';
  target: 'SELF' | 'OTHER' | 'NEIGHBOR' | 'ADJACENT' | 'OPPOSING' | 'OPPONENT';
  targetType: 'ANY' | 'ALL';
  targetConditions: Condition[];
  conditionType: 'ALL' | 'ANY';
  conditions: any[];
  modifiers: any[];

  constructor(other: any) {
    if (other) {
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

  isActive(board: (Card | null)[], enemyBoard: (Card | null)[]): boolean {
    var d = this.conditions.map((condition) => {
      condition.check(board);
    });

    console.log(d);
    return true;
  }

  // check a board, return array of cardIds that should recieve this powers modifier
  getTargets(
    board: (Card | null)[],
    enemyBoard: (Card | null)[]
  ): {
    boardTargetIds: number[];
    enemyBoardTargetIds: number[];
  } {
    return {
      boardTargetIds: [],
      enemyBoardTargetIds: [],
    };
  }
}
