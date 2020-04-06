import * as React from 'react';
import { DeckBuilderProps } from './types';
import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';
import { Button } from 'semantic-ui-react';
import { request } from '../../utils/api';
import { Card } from '../../App/types';
import CSS from 'csstype';

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

  const styles: CSS.Properties = {
    display: 'flex',
    height: '100%',
    width: '100%',
  };

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
      <ul
        style={{
          width: '100%',
        }}
      >
        {cards.map((card: Card) => {
          return (
            <li key={card.id} style={{ display: 'inline-block' }}>
              <div onClick={onCollectionCardClick(card.id)}>
                <div
                  style={{
                    display: 'inline-block',
                    margin: '7px',
                    height: '150px',
                    width: '150px',
                    borderRadius: '50%',
                    border: '6px solid ' + card.colors[0],
                    backgroundImage: `url(/images/normal/released/${card.id}.jpg)`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                ></div>
              </div>
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
    <section style={styles}>
      {renderCollection()}
      {renderDeckList()}
    </section>
  );
};

export default socketConnect(DeckBuilder);
