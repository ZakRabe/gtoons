import Power from '../common/entity/Power';
import Card from '../common/entity/Card';
import { getCards } from '../cards/utils';

const powers: (Power | any)[] = require('./powers.json');

export function getPower(id: number) {
  return powers.find((power) => power.id === id);
  // return power ? power : null;
}

export function getPowers(ids: number[]) {
  return ids.map(getPower);
}

// export function getDeepPower(id: number) {
//   let power = getPower(id);
//   let powers: Power[] = [];

//   if (power) {
//     power.powers.map((pow) => {
//       powers.push(new Power(pow));
//     });
//   }
//   return [...powers];
//   //return power ? new Power(power) : null;
// }

// export function getDeepPowers(ids: number[]) {
//   let powers = ids.map(getDeepPower);
//   console.log(powers);
//   return ids.map(getDeepPower);
// }

export function evaluateBoardPowers(
  p1Board: (number | null)[],
  p2Board: (number | null)[]
) {
  let p1Cards = getCards(p1Board);
  let p1Powers = getPowers(p1Board);

  //let p2Cards = getCards(p2Board);
  //let p2Powers = getPowers(p2Board);

  p1Powers.map((card) => {
    if (card) {
      card.powers.map((power) => {
        //Switch Case for each power type? SINGLE or FOR_EACH
        //console.log(power);
        check(p1Cards, p1Cards, power);
      });
    }
  });
}

function check(p1Cards: (Card | null)[], p2Cards: (Card | null)[], power: any) {
  let isSingleUse = power.type === 'SINGLE';
  let alreadyUsed = false;

  //console.log(power);
  //Check if condition is position based
  let powerID = power.conditions[0].source;
  let powerPosition = -1;
  let isP1Power = false;

  powerPosition = p1Cards.findIndex((card) => card?.id === powerID);
  isP1Power = powerPosition > -1;

  // Check if it is p1 or p2 power
  if (!isP1Power) {
    // If not a p1 power, get position of power in p2 cards
    powerPosition = p2Cards.findIndex((card) => card?.id === powerID);
  }

  // Check Player one cards for conditional matches
  p1Cards.map((card) => {
    if (card) {
      let mustMatchAll = power.conditionType === 'ALL';
      let matching = false;
      let matchingAll = true;

      let result = [];
      // Need to check array position for nextTo, adjacent, opposing, etc..
      console.log(mustMatchAll);
      power.conditions.map((condition) => {
        /*
        Check if you must match all and if you are still matching. If you must match all but
        aren't matching after the first check, skip checking additional powers. Otherwise, if
        you don't need to match all, continue to check.
         */

        if (!alreadyUsed && ((mustMatchAll && matchingAll) || !mustMatchAll)) {
          // Check if attribute is position or card attribute
          if (condition.attribute === 'position') {
            // Checking IS or IS_NOT
            if (condition.condition === 'IS') {
            } else {
            }
          } else {
            if (condition.condition === 'IS') {
              // Checking IS or IS_NOT
              // Check if ARRAY based (colors, groups, types) or SINGLE (character)
              if (Array.isArray(card[condition.attribute])) {
                if (card[condition.attribute].indexOf(condition.value) > -1) {
                  if (isP1Power) {
                    result = checkConditionRestriction(
                      card,
                      power,
                      powerPosition,
                      p1Cards,
                      p2Cards
                    );
                  } else {
                    result = checkConditionRestriction(
                      card,
                      power,
                      powerPosition,
                      p2Cards,
                      p1Cards
                    );
                  }
                } else {
                  matchingAll = false;
                }
              } else {
                //console.log(condition.value);
                if (card[condition.attribute] === condition.value) {
                  if (isP1Power) {
                    result = checkConditionRestriction(
                      card,
                      power,
                      powerPosition,
                      p1Cards,
                      p2Cards
                    );
                  } else {
                    result = checkConditionRestriction(
                      card,
                      power,
                      powerPosition,
                      p2Cards,
                      p1Cards
                    );
                  }
                } else {
                  matchingAll = false;
                }
              }
            }
            // IS NOT
            else {
              // Check if ARRAY based (colors, groups, types) or SINGLE (character)
              console.log('is not effect');
              if (Array.isArray(card[condition.attribute])) {
                if (card[condition.attribute].indexOf(condition.value) === -1) {
                  if (isP1Power) {
                    result = checkConditionRestriction(
                      card,
                      power,
                      powerPosition,
                      p1Cards,
                      p2Cards
                    );
                  } else {
                    result = checkConditionRestriction(
                      card,
                      power,
                      powerPosition,
                      p2Cards,
                      p1Cards
                    );
                  }
                } else {
                  matchingAll = false;
                }
              } else {
                console.log(
                  card[condition.attribute] + '| |' + condition.value
                );
                if (card[condition.attribute] !== condition.value) {
                  if (isP1Power) {
                    result = checkConditionRestriction(
                      card,
                      power,
                      powerPosition,
                      p1Cards,
                      p2Cards
                    );
                  } else {
                    result = checkConditionRestriction(
                      card,
                      power,
                      powerPosition,
                      p2Cards,
                      p1Cards
                    );
                  }
                } else {
                  console.log('matching all is false');
                  matchingAll = false;
                }
              }
            }
          }
        }
      });

      if (result.length > 0) {
        matching = result[0];
        if (matchingAll) {
          matchingAll = result[1];
        }
      }

      if ((mustMatchAll && matchingAll) || (!mustMatchAll && matching)) {
        // Check if single or multiple triggers (SINGLE or FOR_EACH)
        if (isSingleUse && !alreadyUsed) {
          console.log('Single use triggered');
          console.log(
            'The power for ' +
              power.conditions[0].source +
              ' has been triggered on ' +
              card.title
          );
          if (isP1Power) {
            //triggerOnTarget(card, power, powerPosition, p1Cards, p2Cards);
          } else {
            //triggerOnTarget(card, power, powerPosition, p2Cards, p1Cards);
          }
          alreadyUsed = true;
        } else if (!isSingleUse) {
          console.log('Multiuse triggered');
          console.log(
            'The power for ' +
              power.conditions[0].source +
              ' has been triggered on ' +
              card.title
          );
        }
      } else {
      }
    }
  });
}

function positionCondition() {}

function checkConditionRestriction(
  card: Card,
  power: any,
  powerPosition: number,
  powerBoard: (Card | null)[],
  opposingBoard: (Card | null)[]
) {
  let matching = false;
  let matchingAll = true;
  switch (power.conditionRestriction) {
    case 'NONE':
      // Nothing needs to be done.
      matching = true;
      break;
    case 'ADJACENT':
      // Check cards positions adjacent to this powers card
      // Also checks neighbors?

      /*
      Check +3,+4,-3,-4
      Clamps: Can't be less than 0 or more than 6
      Power position 1 [0]: includes +4
      Power position 2 [1]: includes +3,+4
      Power position 3 [2]: includes +3,+4
      Power position 4 [3]: includes +3
      Power position 5 [4]: includes -3,-4
      Power position 6 [5]: includes -3,-4
      Power position 7 [6]: includes -3,-4
       */
      switch (powerPosition) {
        case 0:
          if (
            powerPosition + 4 ===
            powerBoard.findIndex((_card) => _card?.id === card.id)
          ) {
            matching = true;
          } else {
            matchingAll = false;
          }
          break;
        case 1:
        case 2:
          if (
            powerPosition + 3 ===
              powerBoard.findIndex((_card) => _card?.id === card.id) ||
            powerPosition + 4 ===
              powerBoard.findIndex((_card) => _card?.id === card.id)
          ) {
            matching = true;
          } else {
            matchingAll = false;
          }
          break;
        case 3:
          if (
            powerPosition + 3 ===
            powerBoard.findIndex((_card) => _card?.id === card.id)
          ) {
            matching = true;
          } else {
            matchingAll = false;
          }
          break;
        case 4:
        case 5:
        case 6:
          if (
            powerPosition - 3 ===
              powerBoard.findIndex((_card) => _card?.id === card.id) ||
            powerPosition - 4 ===
              powerBoard.findIndex((_card) => _card?.id === card.id)
          ) {
            matching = true;
          } else {
            matchingAll = false;
          }
          break;
      }

    case 'NEIGHBOR':
      /*
      Check +1,-1
      Clamps: Can't be less than 0 or more than 6
      Power position 1 [0]: includes +1
      Power position 4 [3]: includes -1
      Power position 5 [4]: includes +1
      Power position 7 [6]: includes -1
       */
      if (!matching) {
        switch (powerPosition) {
          case 0:
          case 4:
            if (
              powerPosition + 1 ===
              powerBoard.findIndex((_card) => _card?.id === card.id)
            ) {
              matching = true;
            } else {
              matchingAll = false;
            }
            break;
          case 3:
          case 6:
            if (
              powerPosition - 1 ===
              powerBoard.findIndex((_card) => _card?.id === card.id)
            ) {
              matching = true;
            } else {
              matchingAll = false;
            }
            break;
          default:
            if (
              powerPosition + 1 ===
                powerBoard.findIndex((_card) => _card?.id === card.id) ||
              powerPosition - 1 ===
                powerBoard.findIndex((_card) => _card?.id === card.id)
            ) {
              matching = true;
            } else {
              matchingAll = false;
            }
            break;
        }
      }
      break;
    case 'OPPOSING':
      if (
        powerPosition ===
        opposingBoard.findIndex((_card) => _card?.id === card.id)
      ) {
        matching = true;
      } else {
        matchingAll = false;
      }

      break;
    case 'OPPONENT':
      if (opposingBoard.findIndex((_card) => _card?.id === card.id) > -1) {
        matching = true;
      } else {
        matchingAll = false;
      }
      break;
  }

  // going to need to return multiple values?
  return [matching, matchingAll];
}

function triggerOnTarget(
  card: Card,
  power: any,
  powerPosition: number,
  powerBoard: (Card | null)[],
  opposingBoard: (Card | null)[]
) {
  let cardPosition = powerBoard.findIndex((_card) => _card?.id === card.id);
  switch (power.target) {
    case 'SELF':
      // Add modifer to self
      powerBoard[powerPosition].modifiers.push(power.modifiers);
      break;
    case 'OTHER':
      /* 
      Check target type and  target conditions to make sure 
      that the targeted card meets the criteria.
      */
      powerBoard.map((card) => {
        cardPosition = powerBoard.findIndex((_card) => _card?.id === card.id);
        if (card) {
          checkTargetConditions(card, cardPosition, power, powerPosition);
        }
      });

      opposingBoard.map((card) => {
        cardPosition = opposingBoard.findIndex(
          (_card) => _card?.id === card.id
        );
        if (card) {
          checkTargetConditions(card, cardPosition, power, powerPosition);
        }
      });
      break;
    case 'ADJACENT':
      switch (powerPosition) {
        case 0:
          if (powerBoard[powerPosition + 4]) {
            checkTargetConditions(
              powerBoard[powerPosition + 4],
              powerPosition + 4,
              power,
              powerPosition
            );
          }
          break;
        case 1:
        case 2:
          if (powerBoard[powerPosition + 3]) {
            checkTargetConditions(
              powerBoard[powerPosition + 3],
              powerPosition + 3,
              power,
              powerPosition
            );
          }
          if (powerBoard[powerPosition + 4]) {
            checkTargetConditions(
              powerBoard[powerPosition + 4],
              powerPosition + 4,
              power,
              powerPosition
            );
          }
          break;
        case 3:
          if (powerBoard[powerPosition + 3]) {
            checkTargetConditions(
              powerBoard[powerPosition + 3],
              powerPosition + 3,
              power,
              powerPosition
            );
          }
          break;
        case 4:
        case 5:
        case 6:
          if (powerBoard[powerPosition - 3]) {
            checkTargetConditions(
              powerBoard[powerPosition - 3],
              powerPosition - 3,
              power,
              powerPosition
            );
          }
          if (powerBoard[powerPosition - 4]) {
            checkTargetConditions(
              powerBoard[powerPosition - 4],
              powerPosition - 4,
              power,
              powerPosition
            );
          }
          break;
      }
    case 'NEIGHBOR':
      switch (powerPosition) {
        case 0:
        case 4:
          if (powerBoard[powerPosition + 1]) {
            checkTargetConditions(
              powerBoard[powerPosition + 1],
              powerPosition + 1,
              power,
              powerPosition
            );
          }
          break;
        case 3:
        case 6:
          if (powerBoard[powerPosition - 1]) {
            checkTargetConditions(
              powerBoard[powerPosition - 1],
              powerPosition - 1,
              power,
              powerPosition
            );
          }
          break;
        default:
          if (powerBoard[powerPosition + 1]) {
            checkTargetConditions(
              powerBoard[powerPosition + 1],
              powerPosition + 1,
              power,
              powerPosition
            );
          }

          if (powerBoard[powerPosition - 1]) {
            checkTargetConditions(
              powerBoard[powerPosition - 1],
              powerPosition - 1,
              power,
              powerPosition
            );
          }
          break;
      }
      break;
    case 'OPPOSING':
      if (opposingBoard[powerPosition]) {
        checkTargetConditions(
          opposingBoard[powerPosition],
          powerPosition,
          power,
          powerPosition
        );
      }
      break;
    case 'OPPONENT':
      opposingBoard.map((card) => {
        if (card) {
          cardPosition = opposingBoard.findIndex(
            (_card) => _card?.id === card.id
          );
          checkTargetConditions(card, cardPosition, power, powerPosition);
        }
      });
      break;
  }
}

function checkTargetConditions(
  card: Card,
  cardPosition: number,
  power: any,
  powerPosition: number
) {
  let mustMatchAll = power.targetType === 'ALL';
  let matching = false;
  let matchingAll = true;
  power.targetConditions.map((condition) => {
    if ((mustMatchAll && matchingAll) || !mustMatchAll) {
      if (condition.attribute === 'position') {
        // Checking IS or IS_NOT
        if (condition.condition === 'IS') {
          if (cardPosition === condition.value) {
          } else {
            matchingAll = false;
          }
        } else {
          if (cardPosition !== condition.value) {
          } else {
            matchingAll = false;
          }
        }
      } else {
        if (condition.condition === 'IS') {
          if (Array.isArray(card[condition.attribute])) {
            if (card[condition.attribute].indexOf(condition.value) > -1) {
              matching = true;
            } else {
              matchingAll = false;
            }
          } else {
            if (card[condition.attribute] === condition.value) {
            } else {
              matchingAll = false;
            }
          }
        } else {
          if (Array.isArray(card[condition.attribute])) {
            if (card[condition.attribute].indexOf(condition.value) === -1) {
              matching = true;
            } else {
              matchingAll = false;
            }
          } else {
            if (card[condition.attribute] !== condition.value) {
            } else {
              matchingAll = false;
            }
          }
        }
      }
    }
  });

  return [matching, matchingAll];
}
