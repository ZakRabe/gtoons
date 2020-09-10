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
  //Check if condition is position based
  let powerID = power.conditions.source;
  let powerPosition = -1;
  let isP1Power = false;
  // Check Player one cards for conditional matches
  p1Cards.map((card) => {
    if (card) {
      let mustMatchAll = power.conditionType === 'ALL';
      let matching = false;
      let matchingAll = true;
      // Need to check array position for nextTo, adjacent, opposing, etc..
      power.conditions.map((condition) => {
        // Check if attribute is position or card attribute
        if (condition.attribute !== 'position') {
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
                powerPosition = p1Cards.findIndex((card) => {
                  card.id == powerID;
                });
                isP1Power = powerPosition > -1;

                // Check if it is p1 or p2 power
                if (!isP1Power) {
                  // If not a p1 power, get position of power in p2 cards
                  powerPosition = p2Cards.findIndex((card) => {
                    card.id == powerID;
                  });
                }
                switch (power.conditionType) {
                  case 'NONE':
                    // Nothing needs to be done.
                    matching = true;
                    break;
                  case 'ADJACENT':
                    // Check cards positions adjacent to this powers card
                    // Also checks neighbors?
                    if (isP1Power) {
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
                            p1Cards.findIndex((_card) => {
                              _card.id === card.id;
                            })
                          ) {
                            matching = true;
                          }
                          break;
                        case 1:
                        case 2:
                          if (
                            powerPosition + 3 ===
                              p1Cards.findIndex((_card) => {
                                _card.id === card.id;
                              }) ||
                            powerPosition + 4 ===
                              p1Cards.findIndex((_card) => {
                                _card.id === card.id;
                              })
                          ) {
                            matching = true;
                          }
                          break;
                        case 3:
                          if (
                            powerPosition + 3 ===
                            p1Cards.findIndex((_card) => {
                              _card.id === card.id;
                            })
                          ) {
                            matching = true;
                          }
                          break;
                        case 4:
                        case 5:
                        case 6:
                          if (
                            powerPosition - 3 ===
                              p1Cards.findIndex((_card) => {
                                _card.id === card.id;
                              }) ||
                            powerPosition - 4 ===
                              p1Cards.findIndex((_card) => {
                                _card.id === card.id;
                              })
                          ) {
                            matching = true;
                          }
                          break;
                      }
                    } // p2 Power
                    else {
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
                            p2Cards.findIndex((_card) => {
                              _card.id === card.id;
                            })
                          ) {
                            matching = true;
                          }
                          break;
                        case 1:
                        case 2:
                          if (
                            powerPosition + 3 ===
                              p2Cards.findIndex((_card) => {
                                _card.id === card.id;
                              }) ||
                            powerPosition + 4 ===
                              p2Cards.findIndex((_card) => {
                                _card.id === card.id;
                              })
                          ) {
                            matching = true;
                          }
                          break;
                        case 3:
                          if (
                            powerPosition + 3 ===
                            p2Cards.findIndex((_card) => {
                              _card.id === card.id;
                            })
                          ) {
                            matching = true;
                          }
                          break;
                        case 4:
                        case 5:
                        case 6:
                          if (
                            powerPosition - 3 ===
                              p2Cards.findIndex((_card) => {
                                _card.id === card.id;
                              }) ||
                            powerPosition - 4 ===
                              p2Cards.findIndex((_card) => {
                                _card.id === card.id;
                              })
                          ) {
                            matching = true;
                          }
                          break;
                      }
                    }
                  case 'NEIGHBOR':
                    if (isP1Power) {
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
                          if (
                            powerPosition + 1 ===
                            p1Cards.findIndex((_card) => {
                              _card.id === card.id;
                            })
                          ) {
                            matching = true;
                          }
                          break;
                        case 3:
                        case 6:
                          if (
                            powerPosition - 1 ===
                            p1Cards.findIndex((_card) => {
                              _card.id === card.id;
                            })
                          ) {
                            matching = true;
                          }
                          break;
                        default:
                          if (
                            powerPosition + 1 ===
                              p1Cards.findIndex((_card) => {
                                _card.id === card.id;
                              }) ||
                            powerPosition - 1 ===
                              p1Cards.findIndex((_card) => {
                                _card.id === card.id;
                              })
                          ) {
                            matching = true;
                          }
                          break;
                      }
                    }
                    // p2 Power
                    else {
                      switch (powerPosition) {
                        case 0:
                        case 4:
                          if (
                            powerPosition + 1 ===
                            p2Cards.findIndex((_card) => {
                              _card.id === card.id;
                            })
                          ) {
                            matching = true;
                          }
                          break;
                        case 3:
                        case 6:
                          if (
                            powerPosition - 1 ===
                            p2Cards.findIndex((_card) => {
                              _card.id === card.id;
                            })
                          ) {
                            matching = true;
                          }
                          break;
                        default:
                          if (
                            powerPosition + 1 ===
                              p2Cards.findIndex((_card) => {
                                _card.id === card.id;
                              }) ||
                            powerPosition - 1 ===
                              p2Cards.findIndex((_card) => {
                                _card.id === card.id;
                              })
                          ) {
                            matching = true;
                          }
                          break;
                      }
                    }
                    break;
                  case 'OPPOSING':
                    break;
                  case 'OPPONENT':
                    break;
                }
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
            // Check if ARRAY based (colors, groups, types) or SINGLE (character)
            if (Array.isArray(card[condition.attribute])) {
              if (card[condition.attribute].indexOf(condition.value) == -1) {
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
      });

      if ((mustMatchAll && matchingAll) || (!mustMatchAll && matching)) {
        console.log('Trigger power');
      } else {
        console.log('Power not triggered');
      }
    }
  });
}

function positionCondition() {}
