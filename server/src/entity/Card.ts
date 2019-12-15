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
  color: Color;
  rarity: Rarity;
  groups: string[];
  types: string[];
  modifiers: Modifier[];
  points: number;

  applyAttributeModifiers = () => {
    const copy = { ...this };
    this.modifiers.map(mod => {
      const replaceOnly = ['character', 'color'];
      // these values can only be replaced
      if (replaceOnly.includes(mod.attribute)) {
        (copy[mod.attribute] as string | Color) = mod.value as string | Color;
      } else {
        //  all other attributes can be replaced or added to
        if (mod.type === 'replace') {
          (copy[mod.attribute] as string[]) = [mod.value];
        } else {
          (copy[mod.attribute] as string[]) = [
            ...copy[mod.attribute],
            mod.value
          ];
        }
      }
    });
  };
}
