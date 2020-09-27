import { getCards } from '../cards/utils';
import Card from '../common/entity/Card';
import powers from './powers.json';

export function getPower(id: number) {
  const foundPower = (powers as any[]).find((power) => power.id === id);
  return foundPower ? { ...foundPower } : null;
}

export function getPowers(ids: number[]) {
  return ids.map(getPower);
}

export function evaluateBoardPowers(
  p1Board: (number | null)[],
  p2Board: (number | null)[]
) {
  let p1Cards = getCards(p1Board);
  let p1Powers = getPowers(p1Board);

  let p2Cards = getCards(p2Board);
  let p2Powers = getPowers(p2Board);

  checkForDisables(p1Cards, p2Cards);

  p1Powers.map((card) => {
    if (card) {
      card.powers.map((power) => {
        //Switch Case for each power type? SINGLE or FOR_EACH
        //console.log(power);
        // @ts-ignore TODO: need better types for these
        check(p1Cards, p2Cards, power, card.id);
      });
    }
  });
  p2Powers.map((card) => {
    if (card) {
      card.powers.map((power) => {
        //Switch Case for each power type? SINGLE or FOR_EACH
        //console.log(power);
        // @ts-ignore TODO: need better types for these
        check(p2Cards, p1Cards, power, card.id);
      });
    }
  });

  p1Cards.map(applyModifiers);
  p2Cards.map(applyModifiers);

  return { p1Cards, p2Cards };
}

function check(
  playerBoard: (Card | null)[],
  opposingBoard: (Card | null)[],
  power: any,
  powerId: number
) {
  let modifiers = [];

  //Check if condition is position based

  const powerPosition = playerBoard.findIndex((card) => card?.id === powerId);

  if (playerBoard[powerPosition].disabled) {
    return;
  }

  // CHECKING INITIAL CONDITIONS
  playerBoard.map((card) => {
    if (card) {
      modifiers = checkRestrictions(
        card,
        power,
        powerPosition,
        power.conditionRestriction,
        power.conditionType,
        power.conditions,
        modifiers,
        playerBoard,
        opposingBoard,
        false
      );
    }
  });

  opposingBoard.map((card) => {
    if (card) {
      modifiers = checkRestrictions(
        card,
        power,
        powerPosition,
        power.conditionRestriction,
        power.conditionType,
        power.conditions,
        modifiers,
        opposingBoard,
        playerBoard,
        false
      );
    }
  });

  // TARGETTING
  playerBoard.map((card) => {
    if (card) {
      card.modifiers = checkRestrictions(
        card,
        power,
        powerPosition,
        power.target, // Restriction for either condition or target condition
        power.targetType,
        power.targetConditions,
        modifiers,
        playerBoard,
        opposingBoard,
        true // If it is a target condition or regular condition
      );
    }
  });

  opposingBoard.map((card) => {
    if (card) {
      card.modifiers = checkRestrictions(
        card,
        power,
        powerPosition,
        power.target, // Restriction for either condition or target condition
        power.targetType,
        power.targetConditions,
        modifiers,
        opposingBoard,
        playerBoard,
        true // If it is a target condition or regular condition
      );
    }
  });
}

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
  playerBoard: (Card | null)[],
  opposingBoard: (Card | null)[],
  isTargetCondition: boolean
) {
  // Non-target condition specific
  let isSingleUse = power.type === 'SINGLE';

  // GENERAL
  let cardPosition = playerBoard.findIndex((_card) => _card?.id === card.id);
  let matching = false;
  let mustMatchAll = conditionType === 'ALL';
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
      if (card.id === playerBoard[powerPosition].id) {
        console.log(card.title);
        matching = true;
      } else {
        matchingAll = false;
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
          if (playerBoard[powerPosition + 4] === card) {
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
            playerBoard[powerPosition + 3] === card ||
            playerBoard[powerPosition + 4] === card
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
          if (playerBoard[powerPosition + 3] === card) {
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
            playerBoard[powerPosition - 3] === card ||
            playerBoard[powerPosition - 4] === card
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
          if (playerBoard[powerPosition + 1] === card) {
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
          if (playerBoard[powerPosition - 1] === card) {
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
            playerBoard[powerPosition + 1] === card ||
            playerBoard[powerPosition - 1] === card
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
      console.log([card.title, mustMatchAll, matchingAll, matching]);
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
  if (card.disabled) {
    return [false, false];
  }

  if (conditions.length === 0) {
    return [true, true];
  }

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
              matching = true;
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

/*
Apply modifiers to called */
function applyModifiers(card: Card) {
  card?.modifiers?.map((modifier) => {
    switch (modifier.attribute) {
      case 'colors':
        modifyColor(card, modifier);
        break;
      case 'points':
        modifyPoints(card, modifier);
        break;
      case 'disabled':
        disableCard(card);
        break;
    }
  });
}

function modifyColor(card: Card, modifier: any) {
  switch (modifier.type) {
    case 'add':
      // No cards currently support this
      break;
    case 'replace':
      card.colors = [modifier.value];
      break;
  }
}

function modifyPoints(card: Card, modifier: any) {
  switch (modifier.type) {
    case 'add':
      card.points += modifier.value;
      break;
    case 'replace':
      card.points += card.basePoints * modifier.value - card.basePoints;
      break;
  }

  if (card.points < 0) {
    card.points = 0;
  }
}

function disableCard(card: Card) {
  card.points = 0;
}

/*
Check board to see if any cards should be negated and add the negation
modifier to it. */
function checkForDisables(playerBoard: any[], opposingBoard: any[]) {
  playerBoard.map((card) => {
    // If you find a matching character that is not this card in the player board
    playerBoard.map((playerCard) => {
      if (
        playerCard?.character === card?.character &&
        playerCard?.title !== card?.title
      ) {
        if (playerCard?.basePoints === card?.basePoints) {
          card.disabled = true;
          card.modifiers = [
            {
              attribute: 'disabled',
              type: 'disabled',
              value: 'disabled',
              source: playerCard.id,
            },
          ];

          playerCard.disabled = true;
          playerCard.modifiers = [
            {
              attribute: 'disabled',
              type: 'disabled',
              value: 'disabled',
              source: card.id,
            },
          ];
        } else if (playerCard?.basePoints > card?.basePoints) {
          playerCard.disabled = true;
          playerCard.modifiers = [
            {
              attribute: 'disabled',
              type: 'disabled',
              value: 'disabled',
              source: card.id,
            },
          ];
        } else {
          card.disabled = true;
          card.modifiers = [
            {
              attribute: 'disabled',
              type: 'disabled',
              value: 'disabled',
              source: playerCard.id,
            },
          ];
        }
      }
    });

    // If you find a matching character in the opposing board
    opposingBoard.map((opponentCard) => {
      if (opponentCard?.character === card?.character) {
        if (opponentCard?.basePoints === card?.basePoints) {
          card.disabled = true;
          card.modifiers = [
            {
              attribute: 'disabled',
              type: 'disabled',
              value: 'disabled',
              source: opponentCard.id,
            },
          ];

          opponentCard.disabled = true;
          opponentCard.modifiers = [
            {
              attribute: 'disabled',
              type: 'disabled',
              value: 'disabled',
              source: card.id,
            },
          ];
        } else if (opponentCard?.basePoints > card?.basePoints) {
          opponentCard.disabled = true;
          opponentCard.modifiers = [
            {
              attribute: 'disabled',
              type: 'disabled',
              value: 'disabled',
              source: card.id,
            },
          ];
        } else {
          card.disabled = true;
          card.modifiers = [
            {
              attribute: 'disabled',
              type: 'disabled',
              value: 'disabled',
              source: opponentCard.id,
            },
          ];
        }
      }
    });
  });
}
