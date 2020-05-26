import Power from '../common/entity/Power';

const powers: (Power | any)[] = require('./powers.json');

export function getPower(id: number) {
  return powers.find(power => power.id === id).powers;
}

export function getPowers(ids: number[]) {
  return ids.map(getPower);
}

export function getDeepPower(id: number) {
  let power = getPower(id);
  return power ? new Power(power.conditions, power.modifiers) : null;
}

export function getDeepPowers(ids: number[]) {}
