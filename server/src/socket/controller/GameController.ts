import { getRepository } from 'typeorm';
import Collection from '../../common/entity/Collection';
import Deck from '../../common/entity/Deck';
import Game from '../../common/entity/Game';
import Lobby from '../../common/entity/Lobby';
import User from '../../common/entity/User';
import { SockerController } from './SocketController';
import GameState from '../../common/entity/GameState';
import { cardsInCollection, cut } from '../../util';

export class DeckBuilderController extends SockerController {
  private collectionRepository = getRepository(Collection);
  private userRepository = getRepository(User);
  private gameRepository = getRepository(Game);
  private gameStateRepository = getRepository(GameState);
  private deckRepository = getRepository(Deck);
  private lobbyRepository = getRepository(Lobby);

  validateSeat = async (player: User, deck_id: number) => {
    const collection = await this.collectionRepository.find({
      where: {
        player,
      },
    });

    const deck = await this.deckRepository.findOne(deck_id);

    if (deck.player_id !== player.id) {
      console.log(`player: ${player.id} is lying about their deck`);
      return false;
    }

    const { cards } = deck.toJson();
    const collectionIds = collection.map((card) => card.id);
    // their collection has all the cards in the deck
    if (!cardsInCollection(cards, collectionIds)) {
      console.log(`player: ${player.id} is lying about their collection`);
      return false;
    }

    return deck;
  };

  async startGame() {
    const lobbyId = 1;
    const p1Deck_id = 1;
    const p2Deck_id = 2;

    const { seat1, seat2 } = await this.lobbyRepository.findOne(lobbyId);
    // validate player data
    const p1Deck = await this.validateSeat(seat1, p1Deck_id);
    const p2Deck = await this.validateSeat(seat2, p2Deck_id);
    if (!(p1Deck && p2Deck)) {
      return this.cheater();
    }

    const p1CutDeck = Deck.cut(p1Deck.shuffle());
    const p2CutDeck = Deck.cut(p2Deck.shuffle());
    const p1DeckCards = Deck.getCardModels(p1CutDeck);
    const p2DeckCards = Deck.getCardModels(p2CutDeck);

    // generate colors
    const [color1, color2] = Game.generateColors(p1DeckCards, p2DeckCards);

    const newGame = {
      color1,
      color2,
      player1: seat1,
      player2: seat2,
      player1Deck: p1Deck,
      player2Deck: p2Deck,
    };

    const savedGame = this.gameRepository.create(newGame);
    const empty = JSON.stringify([]);
    const newGameState = {
      game_id: savedGame.id,
      turn: 0,
      player1ShuffledDeck: JSON.stringify(p1CutDeck),
      player2ShuffledDeck: JSON.stringify(p2CutDeck),
      player1Board: empty,
      player2Board: empty,
      player1Discard: empty,
      player2Discard: empty,
    };
    const savedGameState = this.gameStateRepository.create(newGameState);

    this.io.emit('gameStarted', {
      game: savedGame.toJson(),
      gameState: savedGameState.toJson(),
    });
  }

  takeTurn = (turn: number, board: number[], player: User, game: Game) => {
    const {
      player1: { id: p1Id },
      player2: { id: p2Id },
    } = game;

    if (!(p1Id === player.id || p2Id === player.id)) {
      // player not in game
      return this.cheater();
    }

    // did they send the right amount of cards
    if (!GameState.validCardCount(turn, board.length)) {
      return this.cheater();
    }

    // do they own the cards

    // are the cards in the deck
    const deck = game.player1Deck;
  };

  cheater() {
    this.io.emit('cheater');
  }
}
export default GameController;
