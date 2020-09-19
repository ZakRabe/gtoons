import Card from '../common/entity/Card';

const cards: Card[] = require('./cards.json');

export function getCard(id: number) {
  const foundCard = cards.find((card) => card.id === id);
  return foundCard ? { ...foundCard } : null;
}

export function getCards(ids: number[]) {
  return ids.map(getCard);
}

export function getDeepCopyCard(id: number) {
  //returns nulls when it shouldn't
  let card = getCard(id);
  return card ? new Card(card) : null;
}

export function getDeepCopyCards(ids: number[]) {
  return ids.map(getDeepCopyCard);
}
