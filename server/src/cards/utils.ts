import Card from '../entity/Card';

const cards: Card[] = require('./cards.json');

function getCard(id: number) {
  return cards.find(card => card.id === id);
}
