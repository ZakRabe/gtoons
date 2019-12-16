import Card, { Color } from './Card';

// base interface all modifiers implement
export interface Modifier {
  attribute: 'character' | 'colors' | 'groups' | 'types' | 'points';
  type?: 'add' | 'replace';
  value: string | Color | number;
  source: number;
  apply: (card: Card) => Card;
}

// a modifier that only replaces, currently only used on the character attribute
export interface ReplaceMod extends Modifier {
  attribute: 'character';
  value: string | Color;
}

// a modifer that can replace or add attributes
export interface VariableMod extends Modifier {
  attribute: 'groups' | 'types' | 'colors';
  value: string;
}

// modifer for the character attribute
export interface CharacterMod extends ReplaceMod {
  attribute: 'character';
  value: string;
}

// modifier for the colors attribute
export interface ColorsMod extends VariableMod {
  attribute: 'colors';
  value: Color;
}

// modifer for points attirbute, adds the value to the existing points values
export interface PointsMod extends Modifier {
  attribute: 'points';
  value: number;
}

// modifier for the groups attirbute, can replace or add
export interface GroupsMod extends VariableMod {
  attribute: 'groups';
}

// modifier for the types attribute, can replace or add
export interface TypesMod extends VariableMod {
  attribute: 'types';
}

// class for replace onlly modifiers (character)
export class ReplaceModifer implements ReplaceMod {
  attribute: 'character';
  value: string | Color;
  source: number;

  constructor(value: string | Color, source: number) {
    this.attribute = 'character';
    this.value = value;
    this.source = source;
  }

  apply(card: Card) {
    const copy = { ...card };
    copy[this.attribute] = this.value as any;
    return copy;
  }
}

// class for a character modifer, replaces the previous character value
export class CharacterModifier extends ReplaceModifer implements CharacterMod {
  attribute: 'character';
  value: string;
  surce: number;

  constructor(value: string, source: number) {
    super(value, source);
  }
}

// class for a modifer that can add or replace values (groups, types, colors)
export class VariableModifer implements VariableMod {
  attribute: 'groups' | 'types' | 'colors';
  type: 'replace' | 'add';
  value: string;
  source: number;

  constructor(
    attribute: 'groups' | 'types' | 'colors',
    type: 'add' | 'replace',
    value: string,
    source: number
  ) {
    this.attribute = attribute;
    this.type = type;
    this.value = value;
    this.source = source;
  }

  apply(card: Card) {
    const copy = { ...card };
    switch (this.type) {
      case 'add':
        copy[this.attribute] = [...card[this.attribute], this.value];
        break;
      case 'replace':
        copy[this.attribute] = [this.value];
        break;
    }

    return copy;
  }
}

// class that adds a color to a cards colors, or replaces the previous colors with a color
export class ColorsModifier extends VariableModifer implements ColorsMod {
  attribute: 'colors';
  type: 'add' | 'replace';
  value: Color;
  source: number;

  constructor(type: 'add' | 'replace', value: string, source: number) {
    super('colors', type, value, source);
  }
}

// class that is for adding poiints to a card
export class PointsModifier implements PointsMod {
  attribute: 'points';
  value: number;
  source: number;

  constructor(value: number, source: number) {
    this.attribute = 'points';
    this.value = value;
    this.source = source;
  }

  apply(card: Card) {
    const copy = { ...card };
    copy[this.attribute] = copy[this.attribute] + this.value;
    return copy;
  }
}

// class for adding a group, or replacing all groups with a group
export class GroupsModifier extends VariableModifer implements GroupsMod {
  attribute: 'groups';

  constructor(type: 'add' | 'replace', value: string, source: number) {
    super('groups', type, value, source);
  }
}

// class for adding a type to the types attribute, or replacing all types with a type
export class TypesModifier extends VariableModifer implements TypesMod {
  attribute: 'types';

  constructor(type: 'add' | 'replace', value: string, source: number) {
    super('types', type, value, source);
  }
}
