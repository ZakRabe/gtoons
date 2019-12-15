import Card, { Color } from './Card';

export interface Modifier {
  attribute: 'character' | 'color' | 'groups' | 'types' | 'points';
  type?: 'add' | 'replace';
  value: string | Color | number;
  apply: (card: Card) => Card;
}

export interface ReplaceMod extends Modifier {
  attribute: 'character' | 'color';
  value: string | Color;
}

export interface VariableMod extends Modifier {
  attribute: 'groups' | 'types';
  value: string;
}

export interface CharacterMod extends ReplaceMod {
  attribute: 'character';
  value: string;
}

export interface ColorMod extends ReplaceMod {
  attribute: 'color';
  value: Color;
}

export interface PointsMod extends Modifier {
  attribute: 'points';
  value: number;
}

export interface GroupsMod extends VariableMod {
  attribute: 'groups';
}

export interface TypesMod extends VariableMod {
  attribute: 'types';
}

export class ReplaceModifer implements ReplaceMod {
  attribute: 'character' | 'color';
  value: string | Color;

  constructor(attribute: 'character' | 'color', value: string | Color) {
    this.attribute = attribute;
    this.value = value;
  }

  apply(card: Card) {
    const copy = { ...card };
    copy[this.attribute] = this.value as any;
    return copy;
  }
}

export class CharacterModifier extends ReplaceModifer implements CharacterMod {
  attribute: 'character';
  value: string;

  constructor(value: string) {
    super('character', value);
  }
}

export class ColorModifier extends ReplaceModifer implements ColorMod {
  attribute: 'color';
  value: Color;

  constructor(value: string) {
    super('color', value);
  }
}

export class PointsModifier implements PointsMod {
  attribute: 'points' = 'points';
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  apply(card: Card) {
    const copy = { ...card };
    copy[this.attribute] = copy[this.attribute] + this.value;
    return copy;
  }
}

export class VariableModifer implements VariableMod {
  attribute: 'groups' | 'types';
  type: 'replace' | 'add';
  value: string;

  constructor(
    attribute: 'groups' | 'types',
    type: 'add' | 'replace',
    value: string
  ) {
    this.attribute = attribute;
    this.type = type;
    this.value = value;
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

export class GroupsModifier extends VariableModifer implements GroupsMod {
  attribute: 'groups';

  constructor(type: 'add' | 'replace', value: string) {
    super('groups', type, value);
  }
}

export class TypesModifier extends VariableModifer implements TypesMod {
  attribute: 'types';

  constructor(type: 'add' | 'replace', value: string) {
    super('types', type, value);
  }
}
