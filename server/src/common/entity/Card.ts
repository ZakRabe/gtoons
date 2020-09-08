// these causing circular dep?
// import { getPower } from '../../powers/utils';
// import { Modifier } from './Modifer';
// import Power from './Power';

export enum Color {
  RED = 'RED',
  ORANGE = 'ORANGE',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
  SILVER = 'SILVER',
  BLACK = 'BLACK',
}

export enum Rarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export default class Card {
  id: number;
  title: string;
  description: string;
  character: string;
  colors: Color[];
  rarity: Rarity;
  groups: string[];
  types: string[];
  powers: any[];
  modifiers: any[];
  // powers: Power[];
  // modifiers: Modifier[];
  points: number;

  constructor(other: any) {
    //console.log(other);
    if (other) {
      this.id = other.id;
      this.title = other.title;
      this.description = other.description;
      this.character = other.character;
      this.colors = other.colors;
      this.rarity = other.rarity;
      this.groups = other.groups;
      this.types = other.types;
      this.powers = other.powers;
      this.modifiers = other.modifiers;
      this.points = other.points;
    }
  }

  applyAttributeModifiers = () => {
    let copy;
    this.modifiers.map((mod) => {
      copy = mod.apply(this);
    });
  };

  checkPower = (board: (Card | null)[]) => {
    //console.log(this);
    // this.powers.map((power) => {
    //   console.log(power);
    //   //power.check(board);
    // });
  };
}
