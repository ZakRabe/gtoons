import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Collection from '../../common/entity/Collection';
import Deck from '../../common/entity/Deck';
import User from '../../common/entity/User';
import { roll } from '../../util';

export class DeckBuilderController {
  private collectionRepository = getRepository(Collection);
  private deckRepository = getRepository(Deck);
  private userRepository = getRepository(User);

  async myCollection(request: Request, response: Response, next: NextFunction) {
    const user = response.locals.jwtPayload;
    const collection = await this.collectionRepository.findOne({
      player: user.userId,
    });
    return collection;
  }

  async saveDeck(request: Request, response: Response, next: NextFunction) {
    const { userId } = response.locals.jwtPayload;
    const user = await this.userRepository.findOne(userId);

    const { name, deck, face, id } = request.body;

    // must be between 1 and 12 cards ling
    const invalidDeckSize = deck.length > 12 || !deck.length;
    // the face card if set, must exist in the deck
    const invalidFaceCard = face != null && !deck.includes(face);
    const isEdit = !!id;
    let existingDeck: Deck = null;
    if (isEdit) {
      existingDeck = await this.deckRepository.findOne({ id });
    }

    // if we're editing a deck, you can only edit your own deck
    const notMyDeck = isEdit && existingDeck.player.id !== userId;

    if (invalidDeckSize || invalidFaceCard || notMyDeck) {
      return response.sendStatus(422);
    }

    let faceId = face;
    if (deck.length && !faceId) {
      const random = roll(0, deck.length - 1);
      faceId = deck[random];
    }

    const newDeck = {
      id: id ? Number(id) : undefined,
      name,
      player: user,
      face: faceId,
      cards: JSON.stringify(deck),
    };
    const { id: savedDeckId } = await this.deckRepository.save(newDeck);
    const savedDeck = await this.deckRepository.findOne({
      id: savedDeckId,
    });

    return savedDeck.toJson();
  }

  async myDeckList(request: Request, response: Response, next: NextFunction) {
    const user = response.locals.jwtPayload;
    const deckLists = await this.deckRepository.find({
      player: { id: user.userId },
    });

    return deckLists.map((deck) => deck.toJson());
  }
}
