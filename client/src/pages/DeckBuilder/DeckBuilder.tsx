import * as React from 'react';
import { DeckBuilderProps } from './types';
import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';
import { Button, Input } from 'semantic-ui-react';
import { request } from '../../utils/api';
import { Card, Deck } from '../../App/types';
import CSS from 'csstype';

export const DeckBuilder = (props: DeckBuilderProps) => {
  const { socket } = props;

  const [collection, setCollection] = React.useState([]);
  const [cards, setCards] = React.useState<Card[]>([]);
  const [name, setName] = React.useState('New Deck');

  const [deck, setDeck] = React.useState<number[]>([]);
  const [deckList, setDeckList] = React.useState<Deck[]>([]);

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

  const onInputChange = (e: React.ChangeEvent) => {
    const {
      target: { value },
    } = e as any;
    console.log(value);

    setName(value);
  };

  React.useEffect(() => {
    request({
      url: 'deckBuilder/myCollection',
    }).then((collectionModel) => {
      const newCollection = JSON.parse(collectionModel.cards);
      setCollection(newCollection);
    });

    request({ url: 'cards/all' }).then(setCards);

    request({ url: 'deckBuilder/myDeckList' }).then((newDeckList) => {
      const t = [...newDeckList];
      setDeckList(t);
      console.log(t);

      //console.log(newDeckList[0]);
    });
  }, []);

  const onCollectionCardClick = (cardId: number) => (e: React.MouseEvent) => {
    //console.log(cardId);
    if (deck.includes(cardId) || deck.length >= 12) {
      return;
    }
    const newDeck = [...deck];
    newDeck.push(cardId);
    setDeck(newDeck);
  };

  const onDeckClick = (clickedDeck: Deck) => (e: React.MouseEvent) => {
    console.log(clickedDeck);
    const savedDeck = JSON.parse(clickedDeck.cards);
    console.log(savedDeck);
    setDeck(savedDeck);
  };

  const onDeckCardClick = (cardId: number) => (e: React.MouseEvent) => {
    console.log(e);
    console.log(cardId);

    const newDeck = [...deck].filter((id) => id !== cardId);
    setDeck(newDeck);
  };

  const saveDeck = () => {
    if (deck.length !== 12) {
      console.log('not enough cards in you deck');
      console.log(deck.length);
      return;
    }

    request({
      method: 'post',
      url: 'deckBuilder/saveDeck',
      data: { name, deck },
    }).then((newDeck: Deck) => {
      console.log();
      const newDeckList: Deck[] = [...deckList];
      newDeckList.push(newDeck);
      setDeckList(newDeckList);
    });
  };

  const onHover = (card: Card) => {
    //console.log(card.title)
    const elemnt: HTMLElement =
      document.getElementById('cardInfo') as HTMLElement;
    const children = elemnt.children as HTMLCollection;

    for (let i = 0; i < children.length; i++) {
      switch (children[i].id) {
        case 'cardImage':
          (children[i] as HTMLElement).style.setProperty(
            'background-image',
            `url(/images/normal/released/${card.id}.jpg)`
          );
          (children[i] as HTMLElement).style.setProperty(
            'border-color',
            `${card.colors[0]}`
          );
          break;
        case 'cardName':
          (children[i] as HTMLElement).innerHTML = card.title;
          break;
        case 'cardPower':
          (children[i] as HTMLElement).innerHTML = card.description;
          break;
        default:
          break;
      }
      //console.log(children[i].id)
    }

    //elemnt.style.setProperty('background-image',`url(/images/normal/released/1.jpg)`)
    //console.log(newStyle)
    //elemnt?.childNodes[0]
  };

  const renderCollection = () => {
    return (
      <ul
        style={{
          width: '75%',
        }}
      >
        {cards.map((card: Card) => {
          return (
            <li key={card.id} style={{ display: 'inline-block' }}>
              <div
                onClick={onCollectionCardClick(card.id)}
                onMouseOver={() => onHover(card)}
              >
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
      <div
        style={{
          width: '20%',
          position: 'fixed',
          right: '0',
          backgroundColor: 'white',
        }}
      >
        <ul>
          {deckList.map((deck: Deck) => {
            return (
              <li key={deck.id} style={{ display: 'block', width: '100%' }}>
                <p onClick={onDeckClick(deck)}>{deck.name}</p>
              </li>
            );
          })}
        </ul>
        <div
          id="cardInfo"
          style={{ width: '100%', height: '350px', backgroundColor: 'white' }}
        >
          <div
            id="cardImage"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 'auto',
              height: '250px',
              width: '250px',
              borderRadius: '50%',
              border: '6px solid grey',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          ></div>
          <p
            id="cardName"
            style={{
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 'bolder',
            }}
          >
            Name
          </p>
          <p id="cardPower" style={{ marginLeft: '25px', fontSize: '15px' }}>
            Power
          </p>
        </div>
        <div>
          <Input
            name="name"
            label="Deck Name"
            value={name}
            onChange={onInputChange}
            style={{ width: '100%' }}
          />
        </div>
        <ul style={{ backgroundColor: 'white' }}>
          {deck.map((cardId) => {
            const card = cards.find((item: Card) => item.id === cardId) as Card;
            return card ? (
              <li
                key={cardId}
                style={{ display: 'block' }}
                onClick={onDeckCardClick(card.id)}
                onMouseOver={() => onHover(card)}
              >
                {card.title}
              </li>
            ) : null;
          })}
        </ul>
        <button style={{ width: '100%' }} onClick={() => saveDeck()}>
          SAVE DECK
        </button>
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
