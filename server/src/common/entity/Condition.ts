import Card, { Color } from './Card';

export default class Condition {
  condition: 'IS' | 'IS_NOT';
  // the attribute we want to check
  attribute: keyof Card | 'position';
  // the value this attribute must be to qualify as a match
  value: string | number | Color;
  // ID of the CARD applying the power.
  source: number;

  constructor({ condition, attribute, value, source }) {
    this.condition = condition;
    this.attribute = attribute;
    this.value = value;
    this.source = source;
  }

  match(card: Card, position: number): boolean {
    if (this.attribute === 'position') {
      return position === this.value;
    }

    const cardValue = card[this.attribute as keyof Card];
    const isArray = Array.isArray(cardValue);

    const needleValue = this.value;

    switch (this.condition) {
      case 'IS':
        return isArray
          ? cardValue.includes(needleValue)
          : cardValue === needleValue;
      case 'IS_NOT':
        return isArray
          ? !cardValue.includes(needleValue)
          : cardValue !== needleValue;
      default:
        return false;
    }
  }
}
