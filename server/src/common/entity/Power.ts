import Card from './Card';
import Condition from './Condition';
import { Modifier } from './Modifer';

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
  conditions: Condition[];
  modifiers: Modifier[];

  constructor(other: any) {
    if (other) {
      this.type = other.type;
      this.conditionRestriction = other.conditionRestriction;
      this.target = other.target;
      this.targetType = other.targetType;
      this.targetConditions = other.targetConditions;
      this.conditionType = other.conditionType;
      this.conditions = other.conditions;
      this.modifiers = (other.modifiers as Modifier[]).map(mod=> {
        switch(mod.type){
          case 'add':
            return new 
            break;
            case 'replace':
              break;
              case 'disabled':
              break;
        }
      } );
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
