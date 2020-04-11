import Card, { Color } from './Card';

/** Must figure out how to deal with multiple criteria at once? 
 * 
 * Possibly figured out. Have a method that will check the number
 * of criteria and the number of values. If the values do not line
 * up do not proceed. Now I need to figure out how to check for 
 * each different possible criteria?
 * 
 * andAll
 * 
 * I need to pass in the modifier here somewhere
 */

 // BASE INTERFACE
export interface Conditional {
    condition:'nextTo'|'forEach';
    attribute: 'character' | 'colors' | 'groups' | 'types' | 'points';
    value: string | Color | number;
    source: number;
    check():boolean;
};

// INTERFACES

/** NextTo
 * Checks for the first possible match and returns true if found.
 */
export interface NextToCond extends Conditional{
    condition:'nextTo';
    attribute: 'character' | 'colors' | 'groups' | 'types' | 'points';
};

/** ForEach
 * Checks for all matches that meet the conditional.
 */
export interface ForEachCond extends Conditional{
    condition:'forEach';
    attribute: 'character' | 'colors' | 'groups' | 'types' | 'points';
};



// CONDITIONALS

export class NextToConditonal implements NextToCond{
    condition:'nextTo';
    attribute: 'character' | 'colors' | 'groups' | 'types' | 'points';
    value: string | Color | number;
    source: number;

    constructor(attribute:'character' | 'colors' | 'groups' | 'types' | 'points',value:string| Color | number,source:number){
        this.attribute = attribute;
        this.value = value;
        this.source = source;
    }
    check(): boolean {
        /* Check to see if the pieces next to this triggers the condition
         * 
         * - Foreach zone next to this card:
         * -- If zone has a card where the specified attribute is equal to the value given
         * --- Apply Modifier
         * --- Break
         */
        return true;
    }
}

export class AdjacentToConditional extends NextToConditonal {
    criteria:'and'|'or';
    condition:'nextTo';
    attribute: 'character' | 'colors' | 'groups' | 'types' | 'points';
    value: string | Color | number;
    source: number;

    constructor(attribute:'character' | 'colors' | 'groups' | 'types' | 'points',value:string| Color | number,source:number){
        super(attribute,value,source);
        this.attribute = attribute;
        this.value = value;
        this.source = source;
    }
    check(): boolean {
        /** Check to see if the pieces adjacent to this triggers the condition
         * Should call super.check() to check the spots next to this card first
         */

         if(!super.check()){
             /** It wasn't found in the neighbors
              * - Foreach zone adjacent to this card:
              * -- If zone has a card where the specified attribute is equal to the value given
              * --- Apply Modifier
              * --- Break
              */
         }
        return true;
    }

}