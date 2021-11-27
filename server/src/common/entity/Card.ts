// these causing circular dep?
import { getPower } from '../../powers/utils';
import { Modifier } from './Modifer';
import Power from './Power';

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
  readonly id: number;
  readonly title: string;
  readonly description: string;
  character: string;
  colors: Color[];
  readonly rarity: Rarity;
  groups: string[];
  types: string[];
  readonly powers: Power[];
  modifiers: Modifier[];
  readonly basePoints: number;
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
      this.basePoints = other.basePoints;
      this.points = other.points;
    }
  }

  get disabled() {
    return !!this.modifiers.filter((mod) => mod.type === 'disabled').length;
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
