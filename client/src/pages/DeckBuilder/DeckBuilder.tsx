import * as React from 'react';
import { DeckBuilderProps } from './types';
import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';
import { Button } from '@material-ui/core';
import { request } from '../../utils/api';
import { Card } from '../../App/types';

export const DeckBuilder = (props: DeckBuilderProps) => {
  const { socket } = props;

  const [collection, setCollection] = React.useState([]);
  const [cards, setCards] = React.useState<Card[]>([]);

  const [deck, setDeck] = React.useState<number[]>([]);

  // display a list of decks
  // Click a card in the collection -> adds it to the current deck
  // Click a card in the deck       -> removes it from the deck
  // save the deck
  // delete the deck
  // Name a deck

  React.useEffect(() => {
    request({
      url: 'deckBuilder/myCollection',
    }).then((collectionModel) => {
      const newCollection = JSON.parse(collectionModel.cards);
      setCollection(newCollection);
    });

    request({ url: 'cards/all' }).then(setCards);
  }, []);

  const onCollectionCardClick = (cardId: number) => (e: React.MouseEvent) => {
    console.log(e);
    console.log(cardId);
    if (deck.includes(cardId)) {
      return;
    }
    const newDeck = [...deck];
    newDeck.push(cardId);
    setDeck(newDeck);
  };

  const renderCollection = () => {
    return (
      <ul>
        {cards.map((card: Card) => {
          return (
            <li key={card.id} onClick={onCollectionCardClick(card.id)}>
              #{card.id} : {card.title}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderDeckList = () => {
    return (
      <div>
        <ul>
          {deck.map((cardId) => {
            const card = cards.find((item: Card) => item.id === cardId) as Card;
            return card ? <li key={cardId}>Added {card.title}</li> : null;
          })}
        </ul>
      </div>
    );
  };

  return (
    <section>
      <Button>{collection.length > 0 ? 'Build a Deck' : 'No Card'}</Button>
      {renderCollection()}
      {renderDeckList()}
    </section>
  );
};

export default socketConnect(DeckBuilder);
