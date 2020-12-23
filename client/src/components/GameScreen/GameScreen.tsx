import React, { useEffect, useState, useContext } from 'react';
import { GameScreenProps } from './types';
import { useSocketNamespace } from '../../utils/hooks';
import { isLoggedIn } from '../../utils/auth';
import { Loading } from 'carbon-components-react';
import Intro from './Intro/Intro';
import Board from '../../pages/Game/components/Board';
import UserContext from '../../contexts/UserContext';
import { Card } from '../../App/types';

/*
Starting animations: 
Spectators joining late shouldn't see this

Players name + Avatar
Colors + Count
Score
Deck card count display

*/

const GameScreen: React.FunctionComponent<GameScreenProps> = (props) => {
  const { game } = props;
  const socket = useSocketNamespace('/games');

  const userContext = useContext(UserContext);

  const [playersConnected, setPlayersConnected] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [hand, setHand] = useState<(Card|null)[]>([]);
  const [movingCard, setMovingCard] = React.useState<(Card|null)>(null);
  const [discarding, setDiscarding] = React.useState(false);
  const [discardedCards, setDiscardedCards] = React.useState<(number)[]>([]);
  const [board, setBoard] = useState<(Card | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [opponentBoard, setOpponentBoard] = useState<(Card | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  let playerNumber = -1;

  // Hand Stuff
  const onHandCardClick = (cardId:number, slot:number) =>{
    
    // If you are discarding, add the card to the discard list
    if(discarding){
      setDiscardedCards(prevDiscard =>{
        const newDiscard = [...prevDiscard]
        const cardInDiscard = newDiscard.findIndex(id => id === cardId)

        
        if(cardInDiscard > -1){
          // remove from discard
          console.log("removing " + cardId + " from the discard pile.")
          newDiscard.splice(cardInDiscard,1);
          console.log(newDiscard);
          return newDiscard;
        }

        console.log("pushing " + cardId + " into the discard pile.")
        newDiscard.push(cardId);
        console.log(newDiscard);
        return newDiscard;
      });
      return
    }

    if(!movingCard?.id){
      setMovingCard(hand[slot]);
    } else {
        const cardOnBoard = board.findIndex(card => card?.id === movingCard.id);
        const cardInHand = hand.findIndex(card => card?.id === movingCard.id);

         if(cardOnBoard > -1 && cardInHand > -1){
           // It shouldn't be possible for a card to be in the hand and on the board at the same time..
         }
         
         if(cardInHand > -1){
           setHand(prevHand =>{
             const newHand = [...prevHand];
             const secondCard = newHand.findIndex(card => card?.id === cardId);

             if(cardInHand !== secondCard){
               newHand[cardInHand] = newHand[secondCard]
               newHand[secondCard] = movingCard
             }
             setMovingCard(null)
             return newHand
           })
        }
        
         if(cardOnBoard > -1){
           setHand(prevHand =>{
             const newHand = [...prevHand]
             const secondCard = newHand.findIndex(card => card?.id === cardId)

             const temp = newHand[secondCard]
              newHand[secondCard] = movingCard
              setBoard(prevBoard =>{
                const newBoard = [...prevBoard]
                newBoard[cardOnBoard] = temp
                return newBoard
              })
             setMovingCard(null)
             return newHand
           })
         }
    }
  }

  const onHandEmptyClick = (slot:number) =>{
    if(movingCard?.id){
      setHand(prevHand =>{
        const newHand = [...prevHand]
        const cardInHand = newHand.findIndex(card => card?.id === movingCard.id)
        if(cardInHand > -1){
          newHand[cardInHand] = null
        }
        newHand[slot] = movingCard
        setMovingCard(null)
        return newHand
      })

      setBoard(prevBoard => {
        const newBoard=[...prevBoard]
        const cardIndex = newBoard.findIndex(card => card?.id === movingCard.id)
        newBoard[cardIndex] = null
        return newBoard
      })
    }
  }

  // Board Stuff
  const onBoardCardClick = (cardId:number,slot?:number) =>{
    // 0 is detected as false
    if(slot !== undefined && slot > -1){
      if(!movingCard?.id){
        setMovingCard(board[slot])
       } else {
         const cardOnBoard = board.findIndex(card => card?.id === movingCard.id)
         const cardInHand = hand.findIndex(card => card?.id === movingCard.id)

         if(cardOnBoard > -1 && cardInHand > -1){
           // It shouldn't be possible for a card to be in the hand and on the board at the same time..
         }
         
         if(cardOnBoard > -1){
           setBoard(prevBoard =>{
             const newBoard = [...prevBoard]
             const secondCard = newBoard.findIndex(card => card?.id === cardId)

             if(cardOnBoard !== secondCard){
               // perform swap
               newBoard[cardOnBoard] = newBoard[secondCard]
               newBoard[secondCard] = movingCard
             }
             setMovingCard(null)
             return newBoard
           })
         }

         if(cardInHand > -1){
          setBoard(prevBoard =>{
            const newBoard = [...prevBoard]
            const secondCard = newBoard.findIndex(card => card?.id === cardId)

              // perform swap
              //newBoard[cardOnBoard] = newBoard[secondCard]
              const temp = newBoard[secondCard]
              newBoard[secondCard] = movingCard
              setHand(prevHand =>{
                const newHand = [...prevHand]
                newHand[cardInHand] = temp
                return newHand
              })
            setMovingCard(null)
            return newBoard
          })
        }
       }
     }
  }

  const onBoardEmptyClick =(slot:number) =>{
    if(movingCard?.id){
      if((game.gameState.turn === 1 && slot < 4) || (game.gameState.turn === 2 && slot > 3 ) ){
        setBoard(prevBoard =>{
          const newBoard = [...prevBoard]
          const cardOnBoard = newBoard.findIndex(card => card?.id === movingCard.id)

          if(cardOnBoard > -1){
            newBoard[cardOnBoard] = null
          }
          newBoard[slot] = movingCard

          return newBoard
        })
        
        setHand(prevHand => {
          const newHand = [...prevHand]
          const cardIndex = newHand.findIndex(card => card?.id === movingCard.id)
          
          newHand[cardIndex] = null
          return newHand
        })
      }
      setMovingCard(null)
    }
  }

  const onSubmit = () =>{
    if(socket){
      if((discarding)){
        const remainingCards = hand.filter((card)=>card !== null && !discardedCards.includes(card.id)).map(card => card?.id)

        socket.emit('discarding',{token: isLoggedIn(), gameId: game.id,remainingCards:remainingCards, discardedCards:discardedCards});
        console.log(hand)
        return;
      }
      const cards = [...board.map(card => {if(card) {return card.id}})]
      socket.emit("lockIn",{token: isLoggedIn(),gameId: game.id, board:cards})
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setIntroPlayed(true);
    }, 12000);
  }, [playersConnected]);

  useEffect(() => {
    if (socket) {
      // announce youself as connected to the gameScreen
      socket.emit('playerConnected', { token: isLoggedIn(), gameId: game.id });

      socket.on('allPlayersConnected', () => {
        setPlayersConnected(true);
      });
      socket.on('handUpdated', (newCards: Card[]) => {
        // this requires the client keep track of what the non-discarded cards was
        // be sure to validate server side
        setDiscarding(false);

        const newHand = [...hand, ...newCards];
        setHand(newHand);
      });

      socket.on('turnResults',(turn:number,playerId:number,p1Cards:Card[],p2Cards:Card[])=>{
          let p1Board = [...p1Cards,...Array.from({length:7-p1Cards.length},()=> null)];
          let p2Board = [...p2Cards,...Array.from({length:7-p2Cards.length},()=> null)];

          game.gameState.turn = turn;
          if(turn === 2){
            setDiscarding(true)
          }

        if(game.player1.id === playerId){
          console.log("player1");
          setBoard(p1Board);
          setOpponentBoard(p2Board);
        } else {
          console.log("player2");
          setBoard(p2Board);
          setOpponentBoard(p1Board);
       }
      });
    }
  }, [socket]);

  const renderLoading = () => {
    return <Loading />;
  };

  const render = () => {
    if (!playersConnected) {
      return renderLoading();
    }
    if (!introPlayed) {
      return <Intro game={game} />;
    }
    const { user } = userContext;

    
    if(user){
      if (game.player1.id === user.userId) {
        playerNumber = 1;
      }
      if (game.player2.id === user.userId) {
        playerNumber = 2;
      }
    }

    return (
      <Board
        playerNumber={playerNumber}
        gameState={game.gameState}
        hand={hand}
        board={board}
        opponentBoard={opponentBoard}
        onSubmit={onSubmit}
        onHandCardClick={onHandCardClick}
        onHandEmptyClick={onHandEmptyClick}
        onBoardCardClick={onBoardCardClick}
        onBoardEmptyClick={onBoardEmptyClick}
      />
    );
  };

  return render();
};

export default GameScreen;
