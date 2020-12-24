import { getRepository } from 'typeorm';
import Collection from '../../common/entity/Collection';
import Deck from '../../common/entity/Deck';
import Game from '../../common/entity/Game';
import Lobby from '../../common/entity/Lobby';
import User from '../../common/entity/User';
import { SockerController } from './SocketController';
import GameState from '../../common/entity/GameState';
import { cardsInCollection, verifyToken } from '../../util';
import { AuthTokenUser } from '../../types';
import { getCards } from '../../cards/utils';
import { evaluateBoardPowers } from '../../powers/utils';

export class GameController extends SockerController {
  private collectionRepository = getRepository(Collection);
  private userRepository = getRepository(User);
  private gameRepository = getRepository(Game);
  private gameStateRepository = getRepository(GameState);
  private deckRepository = getRepository(Deck);
  private lobbyRepository = getRepository(Lobby);

  validateSeat = async (player: User, deck_id: number) => {
    const collection = await this.collectionRepository.findOne({
      where: {
        player: { id: player.id },
      },
    });

    const deck = await this.deckRepository.findOne(deck_id);

    if (deck.player.id !== player.id) {
      console.log(`player: ${player.id} is lying about their deck`);
      return false;
    }

    const { cards } = deck.toJson();
    const { cards: collectionCards } = collection.toJson();
    // their collection has all the cards in the deck
    if (!cardsInCollection(cards, collectionCards)) {
      console.log(`player: ${player.id} is lying about their collection`);
      return false;
    }

    return deck;
  };

  async startGame({ token, lobbyId }) {
    // console.log('hitGameStart');
    let tokenUser: AuthTokenUser;
    try {
      tokenUser = verifyToken(token);
    } catch (error) {
      console.error(error);
      return;
    }

    const lobby = await this.lobbyRepository.findOne(lobbyId);

    if (!lobby) {
      return;
    }

    const { seat1, seat2, seat1Deck, seat2Deck } = lobby;

    // make sure user who requested start is in a seat
    const isSeat1 = seat1 && seat1.id === tokenUser.userId;
    const isSeat2 = seat2 && seat2.id === tokenUser.userId;

    if (!isSeat1 && !isSeat2) {
      console.error('invalid seats');
      return;
    }

    const p1Deck_id = seat1Deck.id;
    const p2Deck_id = seat2Deck.id;

    // validate player data
    const p1Deck = await this.validateSeat(seat1, p1Deck_id);
    const p2Deck = await this.validateSeat(seat2, p2Deck_id);
    if (!(p1Deck && p2Deck)) {
      // console.log('invalidDeckData');
      // console.log(seat1);
      // console.log(seat2);
      // console.log(p1Deck_id);
      // console.log(p2Deck_id);
      return this.cheater();
    }

    const p1CutDeck = Deck.cut(p1Deck.shuffle());
    const p2CutDeck = Deck.cut(p2Deck.shuffle());
    const p1DeckCards = Deck.getCardModels(p1CutDeck);
    const p2DeckCards = Deck.getCardModels(p2CutDeck);
    // console.log('p1 deck');
    // console.log(p1DeckCards);

    // console.log('p2 deck');
    // console.log(p1DeckCards);

    // generate colors
    // @ts-ignore TODO: this erroring on p1DeckCards but not p2DeckCards??
    const [color1, color2] = Game.generateColors(p1DeckCards, p2DeckCards);

    // console.log('colors');
    // console.log(color1);
    // console.log(color2);

    const newGame = {
      color1,
      color2,
      player1: seat1,
      player2: seat2,
      player1Deck: p1Deck,
      player2Deck: p2Deck,
    };

    const { id } = await this.gameRepository.save(newGame);
    const savedGame = await this.gameRepository.findOne(id);
    const empty = JSON.stringify([]);
    const newGameState = {
      game: savedGame,
      turn: 1,
      player1ShuffledDeck: JSON.stringify(p1CutDeck),
      player2ShuffledDeck: JSON.stringify(p2CutDeck),
      player1Board: empty,
      player2Board: empty,
      player1Discard: empty,
      player2Discard: empty,
    };
    const { id: stateId } = await this.gameStateRepository.save(newGameState);

    const savedGameState = await this.gameStateRepository.findOne(stateId);
    // console.log('gameState');
    // console.log(savedGameState);

    lobby.game = savedGame;
    await lobby.save();
    await lobby.reload();

    this.io.emit('lobbyUpdated', lobby.toJson());
  }

  async takeTurn(turn: number, board: number[], player: User, gameId: number){
    const gameRoom = `game/${gameId}`;
    const game = await this.gameRepository.findOne(gameId);
    const gameState = await this.gameStateRepository.findOne({
      where: { game },
    });

    const {
      player1: { id: p1Id },
      player2: { id: p2Id },
    } = game;


    //this.socket.join(gameRoom);
    if (!(p1Id === player.id || p2Id === player.id)) {
      // player not in game
      return this.cheater();
    }

    // did they send the right amount of cards
    // Turn needs to be either converted to 0 index or the switch values need to be shifted down
    const cards = board.filter(e => e !== null);
    const cardSum = cards.length;

    if (!GameState.validCardCount(turn, cardSum)) {
      return this.cheater();
    }
    // do they own the cards
    // are the cards in the deck

    if(p1Id === player.id){
      const deck = game.player1Deck;
      const deckIds : number[] = JSON.parse(deck.cards)
      const prevCards : number[] = JSON.parse(game.gameState.player1Board)
      // Check if card is in deck
      if(!GameState.validateNewCards(cards,deckIds)){
        // Card is not in deck 
        return this.cheater()
      }
      
      const newPlayer1board = JSON.stringify(GameState.updateBoardState(turn,prevCards,cards))
      gameState.player1Board = newPlayer1board
    } else {
      const deck = game.player2Deck;
      const deckIds :number[]= JSON.parse(deck.cards)
      const prevCards : number[] = JSON.parse(game.gameState.player2Board)
      // Check if card is in deck
      if(!GameState.validateNewCards(cards,deckIds)){
        // Card is not in deck 
        return this.cheater()
      }
      
      const newPlayer2Board = JSON.stringify(GameState.updateBoardState(turn,prevCards,cards))
      gameState.player2Board = newPlayer2Board
    }

    await gameState.save();
    await gameState.reload();

    // Check if both players have sent their results
    const p1Board:number[] = JSON.parse(gameState.player1Board)
    const p2Board:number[] = JSON.parse(gameState.player2Board)
    
    // This will need to be modified to handle multiple cases eventually
    // because turns will have different turn card counts and checking 
    // if empty won't be useful after the first turn
    if(p1Board === [] || p2Board === []){
      return
    }

    if(p1Board.length === p2Board.length){
      const {p1Cards,p2Cards} = evaluateBoardPowers(p1Board,p2Board)

      console.log(gameState.turn)
      gameState.turn += 1;
      await gameState.save();
      await gameState.reload();

    
      console.log(gameState.turn)
      this.io.to(gameRoom).emit('turnResults',gameState.turn,player.id,p1Cards, p2Cards);
    } 

    //
  }; 

  cheater() {
    this.io.emit('cheater');
  }

  async playerConnected({ token, gameId }) {
    const gameRoom = `game/${gameId}`;
    let user;
    try {
      user = verifyToken(token);
    } catch (error) {
      console.error(error);
      return;
    }

    const game = await this.gameRepository.findOne(gameId);
    const gameState = await this.gameStateRepository.findOne({
      where: { game },
    });
    if (!game || !gameState) {
      // WTF
      console.error(
        `user ${user.userId} attempted to connect to game ${game.id}, but it doesn't exist`
      );
      return;
    }
    this.socket.join(gameRoom);
    
    const isPlayer1 = game.player1.id === user.userId;
    const isPlayer2 = game.player2.id === user.userId;
    if (isPlayer1 || isPlayer2) {
      gameState.connectedPlayers += 1;
      await gameState.save();
      await gameState.reload();
      let playerRoom = ``;
      if (isPlayer1) {
        playerRoom = `${gameRoom}_player1`;
        this.socket.join(playerRoom);
        this.io
          .to(playerRoom)
          .emit('handUpdated', getCards(gameState.handJson(1, 1)));
      } else {
        playerRoom = `${gameRoom}_player2`;
        this.socket.join(playerRoom);
        this.io
          .to(playerRoom)
          .emit('handUpdated', getCards(gameState.handJson(2, 1)));
      }
      // >= 2 means we let reconnects through
      if (gameState.connectedPlayers >= 2) {
        // Both players have connected.
        // show the shuffle/cut/color in the client
        this.io.to(gameRoom).emit('allPlayersConnected');
      }
    }
  }

  /**
   * Lock in the results from the front-end and perform validation after both sides have sent their cards.
   */
  async lockIn({token, gameId,board}){
    const gameRoom = `game/${gameId}`;
    let user;
    try {
      user = verifyToken(token);
    } catch (error) {
      console.error(error);
      return;
    }

    const game = await this.gameRepository.findOne(gameId);
    const gameState = await this.gameStateRepository.findOne({
      where: { game },
    });

    if (!game || !gameState) {
      // WTF
      console.error(
        `user ${user.userId} attempted to connect to game ${game.id}, but it doesn't exist`
      );
      return;
    }

    this.socket.join(gameRoom);

    const isPlayer1 = game.player1.id === user.userId;
    const isPlayer2 = game.player2.id === user.userId;

    console.log("current cards for player at turn " + gameState.turn)
    if(isPlayer1||isPlayer2){
      await gameState.save();
      await gameState.reload();

      if(isPlayer1){
        this.takeTurn(gameState.turn,board,game.player1,gameId)
      } else {
        this.takeTurn(gameState.turn,board,game.player2,gameId)
      }
    }
  }

  async discarding({token, gameId, remainingCards,discardedCards}){
    const gameRoom = `game/${gameId}`;
    let user;
    try {
      user = verifyToken(token);
    } catch (error) {
      console.error(error);
      return;
    }

    console.log("discarding")
    const game = await this.gameRepository.findOne(gameId);
    const gameState = await this.gameStateRepository.findOne({
      where: { game },
    });

    if (!game || !gameState) {
      // WTF
      console.error(
        `user ${user.userId} attempted to connect to game ${game.id}, but it doesn't exist`
      );
      return;
    }

    //this.socket.join(gameRoom);

    const isPlayer1 = game.player1.id === user.userId;
    const isPlayer2 = game.player2.id === user.userId;
    const discarded = JSON.stringify(discardedCards)
    if(isPlayer1||isPlayer2){
      let playerRoom = ``;
      if(isPlayer1){
        playerRoom = `${gameRoom}_player1`;
        //const p1Discard = JSON.stringify(discardedCards)
        gameState.player1Discard = discarded;

        await gameState.save();
        await gameState.reload();

        console.log('delivering new hand to player 1');
        const newBoard = getCards([...remainingCards,...gameState.handJson(1, 2)]);
        this.socket.join(playerRoom);
        this.io
          .to(playerRoom)
          .emit('handUpdated', newBoard);
      } else {
        playerRoom = `${gameRoom}_player2`;
        //const p2Discard = JSON.stringify(discardedCards)
        gameState.player2Discard = discarded;

        await gameState.save();
        await gameState.reload();

        console.log('delivering new hand to player 2');
        const newBoard = getCards([...remainingCards,...gameState.handJson(2, 2)]);
        this.socket.join(playerRoom);
        this.io
          .to(playerRoom)
          .emit('handUpdated', newBoard);
      }
    }
  }
}
export default GameController;
