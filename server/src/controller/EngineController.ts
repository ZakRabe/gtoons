import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../entity/User';
import Game from '../entity/Game';

import { hashPassword } from '../util';
import * as jwt from 'jsonwebtoken';

export class EngineController {
  private userRepository = getRepository(User);
  private gameRepository = getRepository(Game);

  /** Checks to see if the card that was just reveal is the same character
    * as a card that has already been revealed. 
    * 
    * - If the old cards default point value is greater than the new cards, disable
    * the old card. 
    * 
    * - If the new cards default point value is greater than the old cards, disable 
    * the new card. 
    * 
    * - If the default point values are the same, disable both cards.
    */
  checkClash = (response: Response) => {

  };
  
  /** Resolves the effect of the new card on the board. If an old card
    * is also given, check the new card against old card to see if the
    * old card effect is triggered by the new card in any way.
    */
  resolveCards = (response: Response) =>{
      
  };

  /** Calculate the score for each player after a card has been revealed.
    * Make sure to check for whether a card has been disabled or not.
    */
  calculateScore = (response: Response) => {
      /** 
       * - (POSSIBLE DISABLE EFFECT CHECK)
       * - For each zone in revealed zones (disablingZone)
       * -- If (disablingZone) is not disabled
       * --- For each effect in (disableZone) card's effects
       * ---- If effect is disabling effect
       * ----- Activate effect
       * - For each zone in revealed zones (activatingZone)
       * -- If (activatingZone) is not disabled
       * --- For each zone in revealed zones (checkingZone)
       * ---- If (activatingZone) is not equal to (checkingZone) and (checkingZone) is not disabled
       * ----- For each effect in (activatingZone) card's effects
       * ------ If effect is not a disabling effect
       * ------- Pass (checkingZone) card to effect
       */
  };

  /**  Initialize the state of the game.
    * DATA :
    * - phaseCounter
    * - revealedZones
    * 
    * - players
    * -- playerID 
    * --- deckList
    * --- currentHand
    * --- availableCards
    * --- removedCards
    * 
    * - board
    * -- zoneID
    * --- cardID
    * --- revealed
    * --- disabled
    * --- nextTo
    * --- adjacentTo
    * --- oppositeTo
   */
  initialGame = async (
    request: Request,
    response: Response,
    _next: NextFunction
  ) => {}


  /** Reveal one new card. Send updated board state back to users.
    * Check for clashes and apply new card effects here. If revealing 
    * last card of game, calculate the final score and declare a winner.
    */
  revealCard = async (
    request: Request,
    response: Response,
    _next: NextFunction
  ) => {
      /**
       * - If zone is already revealed return from function?
       * - For each zone in revealed
       * -- Check if the new card clashes
       * - Mark new zone as revealed
       * - Add new zone to revealed
       * - Calculate score
       */

      const { gameID, zoneID } = request.body;

  }

  /** Remove up to 2 cards from the user and fill there hand with new cards.
    * 
    */
  removeCard = async (
    request: Request,
    response: Response,
    _next: NextFunction
  ) => {}

  /** Swap the last card that the user controls. Subtract 10 points from user score if user chooses to swap.
    * 
    */
  swapCard = async (
    request: Request,
    response: Response,
    _next: NextFunction
  ) => {}

  /** Place 4 cards in the first 4 zones of their board
    * 
    */
  phaseOne = async (
    request: Request,
    response: Response,
    _next: NextFunction
  ) => {}

  /** Place 3 cards in the final 3 zones of their board
    * 
    */
  phaseTwo = async (
    request: Request,
    response: Response,
    _next: NextFunction
  ) => {}


}
