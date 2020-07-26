import { Button, Tile } from 'carbon-components-react';
import * as React from 'react';
import { Deck } from '../../App/types';
import { request } from '../../utils/api';
import { DeckListProps } from './types';

const DeckList: React.FunctionComponent<DeckListProps> = (props) => {

  const [decks, setDecks] = React.useState<Deck[]>([]);

  React.useEffect(() => {
    request({ url: 'deckBuilder/myDeckList' }).then(setDecks);
  }, []);

  const loadCards = (deckId: number | null) => {
    const { history } = props;

    history.push(`/deckBuilder/${deckId ? deckId : ''}`);
  };

  return (
    <>
    <section style={{ display: 'flex', flexDirection: 'row' }}>
      {decks.map((deck) => {
        const face = deck.face != null ? deck.face : deck.cards[Math.floor(Math.random() * deck.cards.length)];
        return (
          <section style={{ display: 'flex', flexDirection: 'column', padding: 20 }}>
            <img src={`/images/normal/released/${face}.jpg`} width="250" height="250"/>
            <Tile> {deck.name} </Tile>
            <section style={{ display: 'flex', flexDirection: 'row' }}>
              <Button
              style={{ flex: 'auto' }}
              renderIcon={() => (
                <i className="fas fa-pencil"/>
              )}
              onClick={() => loadCards(deck.id)}
              >
              Edit
              </Button>
              <Button
              style={{ flex: 'auto' }}
              renderIcon={() => (
                <i className="fas fa-trash"/>
              )}
              kind='danger'
              disabled
              >
              Delete
              </Button>
            </section>
          </section>
        )
      })}
    </section>
    <section>
      <Button
        onClick={() => loadCards(null)}
        renderIcon={() => (
          <i className="fas fa-plus"/>
        )}
      >
        New Deck
      </Button>
    </section>
    </>
  );
};

export default DeckList;
