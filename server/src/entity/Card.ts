import { Modifier } from './Modifer';

export enum Color {
  RED = 'RED',
  ORANGE = 'ORANGE',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
  SILVER = 'SILVER',
  BLACK = 'BLACK'
}

export enum Rarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export default class Card {
  id: number;
  title: string;
  description: string;
  character: string;
  color: Color[];
  rarity: Rarity;
  groups: string[];
  types: string[];
  modifiers: Modifier[];
  points: number;

  applyAttributeModifiers = () => {
    let copy;
    this.modifiers.map(mod => {
      copy = mod.apply(this);
    });
  };
}
