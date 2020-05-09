import Card from '../common/entity/Card';

const cards: Card[] = require('./cards.json');

function getCard(id: number) {
  return cards.find((card) => card.id === id);
}

export function getCards(ids: number[]) {
  return ids.map(getCard);
}
