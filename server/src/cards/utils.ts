import Card from '../common/entity/Card';

import cards from './cards.json';

export function getCard(id: number) {
  const foundCard = cards.find((card) => card.id === id);
  return foundCard ? new Card({ ...foundCard }) : null;
}

export function getCards(ids: number[]) {
  return ids.map(getCard);
}

export function getDeepCopyCard(id: number) {
  //returns nulls when it shouldn't
  let card = getCard(id);
  return card ? (new Card(card) as Card) : null;
}

export function getDeepCopyCards(ids: number[]) {
  return ids.map(getDeepCopyCard);
}
