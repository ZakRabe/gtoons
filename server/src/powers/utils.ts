import { getCards } from '../cards/utils';
import Card from '../common/entity/Card';
import Condition from '../common/entity/Condition';
import { DisableModifier } from '../common/entity/Modifer';
import Power from '../common/entity/Power';
import powers from './powers.json';

export function getPower(id: number): Pick<Card, 'id' | 'powers'> {
  const cardPower = (powers as any[]).find((power) => power.id === id);
  return {
    id,
    powers: cardPower ? cardPower.powers.map((power) => new Power(power)) : [],
  };
}

export function getPowers(ids: number[]) {
  return ids.map(getPower);
}

export function addCardPowers(card: Card): Card {
  const power = getPower(card.id);
  return new Card({ ...card, ...power });
}

export function getCardsAndPowers(cardIds: (number | null)[]) {
  return getCards(cardIds).map(addCardPowers);
}

// TODO: Instead of resolving one board, then the other : resolve one card at a time for each board
// Check board1 card 1, apply modifiers
// check board2 card 1, apply modifiers
// check board2 card 1, stop

/**
 * Enemy
 *          [Z] [Y] [X] [W] [V] [U] [T]
 * Player
 *          [A] [B] [C] [D] [E] [F] [G]
 *
 * Find Targets for A
 *    A.applyAttributeModifiers()
 * Find Targets for Z
 *    A, Z
 * Find Targets for B
 *    A, Z, B
 * Find Targets for Y
 *    A, Z, B, Y
 */
interface EvalBoard {
  cards: Card[];
  powers: Power[];
}
const addModifiers = (board: EvalBoard, enemyBoard: EvalBoard) => {
  //
};

export function evaluateBoardPowers(
  p1Board: (number | null)[],
  p2Board: (number | null)[]
) {
  const p1Cards = getCardsAndPowers(p1Board);
  const p2Cards = getCardsAndPowers(p2Board);

  addDisabledModifiers(p1Cards, p2Cards);

  const p1ActivePowers: Power[] = [];
  p1Cards.map((card) => {
    if (card) {
      card.powers.map((power) => {
        if (power.isActive(p1Cards, p2Cards)) {
          p1ActivePowers.push(power);
        }
      });
    }
  });
  const p2ActivePowers: Power[] = [];
  p2Cards.map((card) => {
    if (card) {
      card.powers.map((power) => {
        if (power.isActive(p2Cards, p1Cards)) {
          p2ActivePowers.push(power);
        }
      });
    }
  });

  addModifiers(
    { cards: p1Cards, powers: p1ActivePowers },
    { cards: p2Cards, powers: p2ActivePowers }
  );

  // p1Cards.map(applyModifiers);
  const p1Targets = p1ActivePowers.map((power) =>
    power.getTargets(p1Cards, p2Cards)
  );
  // p2Cards.map(applyModifiers);
  const p2Targets = p2ActivePowers.map((power) =>
    power.getTargets(p2Cards, p1Cards)
  );

  // this needs to be alternating

  // push modifiers from powers into target cards on the board
  p1Targets.map(({ boardTargetIds, enemyBoardTargetIds }, index) => {
    const power = p1ActivePowers[index];
    p1Cards.forEach((card) => {
      if (!boardTargetIds.includes(card.id)) {
        return;
      }
      card.modifiers = [...card.modifiers, ...power.modifiers];
    });
    p2Cards.forEach((card) => {
      if (!enemyBoardTargetIds.includes(card.id)) {
        return;
      }
      card.modifiers = [...card.modifiers, ...power.modifiers];
    });
  });
  // push modifiers from powers into target cards on the board
  p2Targets.map(({ boardTargetIds, enemyBoardTargetIds }, index) => {
    const power = p1ActivePowers[index];
    p2Cards.forEach((card) => {
      if (!boardTargetIds.includes(card.id)) {
        return;
      }
      card.modifiers = [...card.modifiers, ...power.modifiers];
    });
    p1Cards.forEach((card) => {
      if (!enemyBoardTargetIds.includes(card.id)) {
        return;
      }
      card.modifiers = [...card.modifiers, ...power.modifiers];
    });
  });

  return { p1Cards, p2Cards };
}

function check(
  playerBoard: (Card | null)[],
  opposingBoard: (Card | null)[],
  power: Power,
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
  conditionType: Power['conditionType'],
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
  let results = {};

  switch (restriction) {
    case 'NONE':
      results = checkConditions(card, cardPosition, conditionType, conditions);
      break;
    case 'SELF':
      // Add modifer to self
      if (card.id === playerBoard[powerPosition].id) {
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
      results = checkConditions(card, cardPosition, conditionType, conditions);
      break;
    // @ts-ignore fall-through to neighbors is intended
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
          conditionType,
          conditions
        );
      }
      break;
  }

  if (results) {
    matching = results[0];
    if (matchingAll) {
      matchingAll = results[1];
    }
  } else {
    if (restriction !== 'SELF') {
      matching = false;
      matchingAll = false;
    }
  }

  if ((mustMatchAll && matchingAll) || (!mustMatchAll && matching)) {
    //Add modifiers
    if (isTargetCondition) {
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
  conditionType: Power['conditionType'],
  conditions: Condition[]
) {
  let mustMatchAll = conditionType === 'ALL';
  let matchesAny = false;
  let matchesAll = true;

  if (card.disabled) {
    return false;
  }

  if (conditions.length === 0) {
    return true;
  }

  conditions
    .map((condition) => new Condition(condition))
    .forEach((condition) => {
      const match = condition.match(card, cardPosition);
      if (mustMatchAll && !match) {
        matchesAll = false;
      }
      matchesAny = match || matchesAny;
    });

  return matchesAny || matchesAll;
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
      // case 'disabled':
      //   disableCard(card);
      //   break;
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
function addDisabledModifiers(
  playerBoard: (Card | null)[],
  opposingBoard: (Card | null)[]
) {
  // remove nulls
  const bothBoards = [...playerBoard, ...opposingBoard].filter(
    (card) => !!card
  );

  // find duplicates by title - disable all
  const duplicatedTitleCards = bothBoards.filter(
    (needle, index) =>
      index !== bothBoards.findIndex((card) => card.id === needle.id)
  );

  // find duplicate card.character - disable all but the lowest
  const duplicatedCharacters = bothBoards
    .filter(
      (needle, index) =>
        index !==
        bothBoards.findIndex((card) => card.character === needle.character)
    )
    .map((card) => card.character);

  const uniqueDuplicatedCharacters = Array.from(new Set(duplicatedCharacters));

  const characterDuplicatedCards = uniqueDuplicatedCharacters.map((character) =>
    bothBoards.filter((card) => card.character === character)
  );

  const disabledSourceCards: Card[] = [];

  // if the lowest is a tie  - figure out later
  const characterDisabledCards = characterDuplicatedCards
    .map((cards) => {
      // sort by base points
      const disabled = [...cards].sort(
        (cardA, cardB) => cardA.basePoints - cardB.basePoints
      );
      // remove the lowest basePoints card. the rest should be disabled
      const disabledSource = disabled.shift();
      disabledSourceCards.push(disabledSource);
      return disabled;
    })
    .flat();

  const allDisabledCardIds = [
    ...duplicatedTitleCards,
    ...characterDisabledCards,
  ].map((card) => card.id);

  const disableCards = (card) => {
    if (!card) {
      return;
    }
    if (allDisabledCardIds.includes(card.id)) {
      const isCardDisabledByCharacter = !!characterDisabledCards.find(
        (disabledCard) => disabledCard.id === card.id
      );

      const disabledSourceId = isCardDisabledByCharacter
        ? disabledSourceCards.find(
            (source) => source.character === card.character
          )?.id
        : card.id;

      const disabledMod = new DisableModifier(disabledSourceId);
      card.modifiers.push(disabledMod);
    }
  };

  playerBoard.forEach(disableCards);
  opposingBoard.forEach(disableCards);
}
