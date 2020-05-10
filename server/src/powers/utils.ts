import Power from '../common/entity/Power';

const powers: Power[] = require('./powers.json');

export function getPower(id: number) {
  return powers.find(power => power.id === id);
}

export function getPowers(ids: number[]) {
  return ids.map(getPower);
}
