import Power from '../common/entity/Power';
import Card from '../common/entity/Card';
import { getCards } from '../cards/utils';
import { cardsInCollection } from '../util';

const powers: (Power | any)[] = require('./powers.json');

export function getPower(id: number) {
  const foundPower = powers.find((power) => power.id === id);
  return foundPower ? { ...foundPower } : null;
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

  let p2Cards = getCards(p2Board);
  let p2Powers = getPowers(p2Board);

  p1Powers.map((card) => {
    if (card) {
      card.powers.map((power) => {
        //Switch Case for each power type? SINGLE or FOR_EACH
        //console.log(power);
        check(p1Cards, p2Cards, power);
      });
    }
  });

  p2Powers.map((card) => {
    if (card) {
      card.powers.map((power) => {
        //Switch Case for each power type? SINGLE or FOR_EACH
        //console.log(power);
        check(p2Cards, p1Cards, power);
      });
    }
  });

  return { p1Cards, p2Cards };
}

function check(
  powerBoard: (Card | null)[],
  opposingBoard: (Card | null)[],
  power: any
) {
  let modifiers = [];

  //console.log(power);
  //Check if condition is position based
  let powerID = power.conditions[0].source;
  const powerPosition = powerBoard.findIndex((card) => card?.id === powerID);

  // CHECKING INITIAL CONDITIONS
  powerBoard.map((card) => {
    if (card) {
      modifiers = checkRestrictions(
        card,
        power,
        powerPosition,
        power.conditionRestriction,
        power.conditionType,
        power.conditions,
        modifiers,
        powerBoard,
        opposingBoard,
        false
      );
    }
  });

  // opposingBoard.map((card) => {
  //   if (card) {
  //     modifiers = checkRestrictions(
  //       card,
  //       power,
  //       powerPosition,
  //       power.conditionRestriction,
  //       power.conditionType,
  //       power.conditions,
  //       modifiers,
  //       opposingBoard,
  //       powerBoard,
  //       false
  //     );
  //   }
  // });

  // TARGETTING
  powerBoard.map((card) => {
    if (card) {
      card.modifiers = checkRestrictions(
        card,
        power,
        powerPosition,
        power.target, // Restriction for either condition or target condition
        power.targetType,
        power.targetConditions,
        modifiers,
        powerBoard,
        opposingBoard,
        true // If it is a target condition or regular condition
      );
    }
  });

  // opposingBoard.map((card) => {
  //   if (card) {
  //     card.modifiers = checkRestrictions(
  //       card,
  //       power,
  //       powerPosition,
  //       power.target, // Restriction for either condition or target condition
  //       power.targetType,
  //       power.targetConditions,
  //       modifiers,
  //       opposingBoard,
  //       powerBoard,
  //       true // If it is a target condition or regular condition
  //     );
  //   }
  // });
}

function positionCondition() {}

/*
 */
function checkRestrictions(
  card: Card,
  power: any,
  powerPosition: number,
  restriction: any,
  conditionType: any,
  conditions: any[],
  modifiers: any[],
  powerBoard: (Card | null)[],
  opposingBoard: (Card | null)[],
  isTargetCondition: boolean
) {
  // Non-target condition specific
  let isSingleUse = power.type === 'SINGLE';

  // GENERAL
  let cardPosition = powerBoard.findIndex((_card) => _card?.id === card.id);
  let matching = false;
  let mustMatchAll = power.targetType === 'ALL';
  let matchingAll = true;
  let results = [];

  switch (restriction) {
    case 'NONE':
      results = checkConditions(
        card,
        cardPosition,
        power,
        powerPosition,
        conditionType,
        conditions
      );
      break;
    case 'SELF':
      // Add modifer to self
      if (card.id === powerBoard[powerPosition].id) {
        matching = true;
      }
      break;
    case 'OTHER':
      /* 
      Check target type and  target conditions to make sure 
      that the targeted card meets the criteria.
      */
      results = checkConditions(
        card,
        cardPosition,
        power,
        powerPosition,
        conditionType,
        conditions
      );
      break;
    case 'ADJACENT':
      /* 
      Check cards positions adjacent to this powers card
      Also checks neighbors?

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
          if (powerBoard[powerPosition + 4] === card) {
            results = checkConditions(
              card,
              cardPosition,
              power,
              powerPosition,
              conditionType,
              conditions
            );
          }
          break;
        case 1:
        case 2:
          if (
            powerBoard[powerPosition + 3] === card ||
            powerBoard[powerPosition + 4] === card
          ) {
            results = checkConditions(
              card,
              cardPosition,
              power,
              powerPosition,
              conditionType,
              conditions
            );
          }
          break;
        case 3:
          if (powerBoard[powerPosition + 3] === card) {
            results = checkConditions(
              card,
              cardPosition,
              power,
              powerPosition,
              conditionType,
              conditions
            );
          }
          break;
        case 4:
        case 5:
        case 6:
          if (
            powerBoard[powerPosition - 3] === card ||
            powerBoard[powerPosition - 4] === card
          ) {
            results = checkConditions(
              card,
              cardPosition,
              power,
              powerPosition,
              conditionType,
              conditions
            );
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
      switch (powerPosition) {
        case 0:
        case 4:
          if (powerBoard[powerPosition + 1] === card) {
            results = checkConditions(
              card,
              cardPosition,
              power,
              powerPosition,
              conditionType,
              conditions
            );
          }
          break;
        case 3:
        case 6:
          if (powerBoard[powerPosition - 1] === card) {
            results = checkConditions(
              card,
              cardPosition,
              power,
              powerPosition,
              conditionType,
              conditions
            );
          }
          break;
        default:
          if (
            powerBoard[powerPosition + 1] === card ||
            powerBoard[powerPosition - 1] === card
          ) {
            results = checkConditions(
              card,
              cardPosition,
              power,
              powerPosition,
              conditionType,
              conditions
            );
          }
          break;
      }
      break;
    case 'OPPOSING':
      if (opposingBoard[powerPosition] === card) {
        results = checkConditions(
          card,
          powerPosition,
          power,
          powerPosition,
          conditionType,
          conditions
        );
      }
      break;
    case 'OPPONENT':
      if (opposingBoard.findIndex((_card) => _card?.id === card.id) > -1) {
        results = checkConditions(
          card,
          cardPosition,
          power,
          powerPosition,
          conditionType,
          conditions
        );
      }
      break;
  }

  if (results.length > 0) {
    matching = results[0];
    if (matchingAll) {
      matchingAll = results[1];
    }
  }

  if ((mustMatchAll && matchingAll) || (!mustMatchAll && matching)) {
    //Add modifiers
    if (isTargetCondition) {
      //card.modifiers = modifiers;
      // console.log('The card ' + card.title + ' was given the modifier:');
      // console.log(card.modifiers);
      // console.log('from ' + powerBoard[powerPosition].title + '.\n');

      // Return the modified card
      return card.modifiers ? [...card.modifiers, ...modifiers] : modifiers;
    } else {
      // TODO: Move condition check to this area.
      // Check if single or multiple triggers (SINGLE or FOR_EACH)
      if (isSingleUse) {
        modifiers = [...power.modifiers];
      } else {
        modifiers = [...modifiers, ...power.modifiers];
      }
      // Return the modifiers array
      //return modifiers;
    }
  }

  if (isTargetCondition) {
    //console.log(card.modifiers);
    return card.modifiers;
  }
  return modifiers;
}

/*
Checks if the card meets the condition given. 
Returns matching and matchingAll as results
 */
function checkConditions(
  card: Card,
  cardPosition: number,
  power: any,
  powerPosition: number,
  conditionType: any,
  conditions: any[]
) {
  let mustMatchAll = conditionType === 'ALL';
  let matching = false;
  let matchingAll = true;
  conditions.map((condition) => {
    if ((mustMatchAll && matchingAll) || !mustMatchAll) {
      if (condition.attribute === 'position') {
        // Checking IS or IS_NOT
        if (condition.condition === 'IS') {
          if (cardPosition === condition.value) {
            matching = true;
          } else {
            matchingAll = false;
          }
        } else {
          if (cardPosition !== condition.value) {
            matching = true;
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
              matching = true;
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
