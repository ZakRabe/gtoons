import { Button, TextInput } from 'carbon-components-react';
import * as React from 'react';
import { Card } from '../../App/types';
import CardComponent from '../../components/Card';
import { request } from '../../utils/api';
import ColorButton from './components/ColorButton';
import { DeckBuilderProps } from './types';
import { Deck } from '../../App/types';
import { useCallback, useRef } from 'react';

export const DeckBuilder = (props: DeckBuilderProps) => {
  var {
    match: {
      params: { deckId },
    },
  } = props;

  const colorOptions = [
    'BLACK',
    'BLUE',
    'GREEN',
    'ORANGE',
    'PURPLE',
    'RED',
    'SILVER',
    'YELLOW',
  ];

  const [collection, setCollection] = React.useState([]);
  const [colorFilters, setFilters] = React.useState(colorOptions);
  const [search, setSearch] = React.useState('');
  const [hoveredCard, setHoveredCard] = React.useState<Card | null>(null);
  const [allCards, setAllCards] = React.useState<Card[]>([]);
  const [deckName, setDeckName] = React.useState('New Deck');
  const [deck, setDeck] = React.useState<number[]>([]);
  const [face, setFace] = React.useState<number | null>(null);

  const styles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  };

  const filtersStyles = {
    display: 'flex',
    paddingBottom: 8,
  };

  const editorStyles = {
    display: 'flex',
    flexGrow: 1,
  };

  const deckListStyles = {
    display: 'flex',
    width: '20vw',
    flexShrink: 0,
  };

  const collectionContainerStyles = {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative' as any,
  };

  const collectionWrapperStyles = {
    position: 'absolute' as any,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'auto',
  };

  const onNameInputChange = (e: React.ChangeEvent) => {
    const {
      target: { value },
    } = e as any;

    setDeckName(value);
  };

  React.useEffect(() => {
    // not needed yet since players have access to all cards in alpha
    // request({
    //   url: 'deckBuilder/myCollection',
    // }).then((collectionModel) => {
    //   const newCollection = JSON.parse(collectionModel.cards);
    //   setCollection(newCollection);
    // });
    if (deckId != null) {
      // why are we loading all the decks when we want to edit only one?
      // TODO: change this to load exactly one deck by id
      request({ url: 'deckBuilder/myDeckList' }).then((decks: Deck[]) => {
        let result = decks.find((deck) => {
          return deck.id === Number(deckId);
        });
        if (result == null) {
          deckId = null;
        } else {
          const { cards, name, face } = result;
          setDeck(cards);
          setDeckName(name);
          setFace(face);
        }
      });
    }
    request({ url: 'cards/all' }).then(setAllCards);
  }, []);

  const latestDeck = useRef(deck);
  
  React.useEffect(()=>{latestDeck.current = deck},[deck]);

  const onCollectionCardClick = (cardId: number) => (e: React.MouseEvent) => {
    const currentDeck = latestDeck.current;
    if (currentDeck.includes(cardId) || currentDeck.length >= 12) {
      return;
    }

    const newDeck = [...currentDeck];
    newDeck.push(cardId);
    setDeck(newDeck);
  };

  const onDeckCardClick = (cardId: number) => (e: React.MouseEvent) => {
    // console.log(e);
    // console.log(cardId);
    const newDeck = [...deck].filter((id) => id !== cardId);
    setDeck(newDeck);
    if (face === cardId) {
      setFace(null);
    }
  };

  const onFaceClick = (cardId: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setFace(face === cardId ? null : cardId);
  };

  const saveDeck = () => {
    request({
      method: 'post',
      url: 'deckBuilder/saveDeck',
      data: {
        face,
        deck,
        name: deckName,
        id: deckId,
      },
    })
      .then((deck: Deck) => {
        deckId = deck.id;
        console.log('save successful');
      })
      .catch((error) => {
        console.log('save failed', error);
      });
  };

  const onHover = (card: Card) => {
    setHoveredCard(card);
  };

  const toggleColor = (color: string) => (e: React.MouseEvent) => {
    const newFilters = colorFilters.includes(color)
      ? colorFilters.filter((filterColor) => filterColor !== color)
      : [...colorFilters, color];
    // console.log(newFilters);

    setFilters(newFilters);
  };

  const onSearchInputChange = (e: React.ChangeEvent) => {
    const {
      target: { value },
    } = e as any;
    // console.log(value);

    setSearch(value);
  };

  const attrContainsSearchTerms = (attr: string, searchTerm: string) => {
    return searchTerm
      .toLowerCase()
      .split(' ')
      .every((word) => attr.toLowerCase().includes(word));
  };

  const checkForTerm = (card: Card, searchTerm: string): boolean => {
    const fields = [
      card.title,
      card.character,
      card.description,
      card.groups.join(' '),
      card.types.join(' '),
    ];

    // dont match on points for examples like "+8" or "-5"
    const isPointMatch =
      card.points === Number(searchTerm) &&
      !searchTerm.includes('+') &&
      !searchTerm.includes('-');

    let matchesColor = false;
    if (colorOptions.includes(searchTerm.toUpperCase())) {
      matchesColor = card.colors.includes(searchTerm.toUpperCase());
    }

    const isInFields = fields.reduce((acc: boolean, value: string) => {
      return (acc = acc ? acc : attrContainsSearchTerms(value, searchTerm));
    }, false);
    return isInFields || matchesColor || isPointMatch;
  };

  const filterByColor = (cards: Card[], activeColors: string[]): Card[] => {
    //console.log('filterByColor');
    return cards.filter((card: Card) =>
      card.colors.some((cardColor) => activeColors.includes(cardColor))
    );
  };

  const filterBySearchTerm = (cards: Card[], searchTerm: string): Card[] => {
    //console.log('filterBySearchTerm');
    if (!searchTerm.length) {
      return cards;
    }
    return cards.filter((card) => checkForTerm(card, searchTerm));
  };

  const colorMatches = React.useMemo(
    () => filterByColor(allCards, colorFilters),
    [allCards, colorFilters]
  );

  const searchMatches = React.useMemo(
    () => filterBySearchTerm(allCards, search),
    [allCards, search]
  );

  const allMatches = React.useMemo(
    () =>
      allCards
        .filter((card) => searchMatches.includes(card))
        .filter((card) => colorMatches.includes(card)),
    [allCards, searchMatches, colorMatches]
  );

  const renderCollection = () => {
    return allMatches.map((card: Card) => {
      return (
        <CardComponent
          key={card.id}
          model={card}
          onClick={onCollectionCardClick(card.id)}
          onHover={() => onHover(card)}
          width={150}
          height={150}
        />
      );
    });
  };

  const renderedCollection = React.useMemo(() => renderCollection(), [
    allMatches,
  ]);

  const renderDeckList = () => {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div>
            <TextInput
              id="deckName"
              labelText=""
              name="name"
              value={deckName}
              onChange={onNameInputChange}
              style={{ width: '100%' }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'white',
              flexDirection: 'column',
              textAlign: 'center',
              height: 350,
            }}
          >
            {hoveredCard && (
              <CardComponent model={hoveredCard} width={250} height={250} />
            )}
            <p
              id="cardName"
              style={{
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 'bolder',
              }}
            >
              {hoveredCard && hoveredCard.title}
            </p>
            <p id="cardPower" style={{ fontSize: '15px' }}>
              {hoveredCard && hoveredCard.description}
            </p>
          </div>
          <div
            style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}
          >
            <ul
              style={{
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                padding: 0,
              }}
            >
              {deck.map((cardId) => {
                const card = allCards.find(
                  (item: Card) => item.id === cardId
                ) as Card;
                return (
                  card && (
                    <li
                      key={cardId}
                      onClick={onDeckCardClick(card.id)}
                      onMouseOver={() => onHover(card)}
                      style={{
                        display: 'flex',
                        height: '8.33%',
                        alignItems: 'center',
                        border: `1px solid ${card.colors[0]}`,
                        fontWeight: 'bolder',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: '5%',
                          backgroundColor: `${card.colors[0]}`,
                        }}
                      ></div>
                      <div
                        style={{
                          fontSize: '3vh',
                        }}
                      >
                        <i
                          className={`${
                            face === card.id ? 'fas' : `far`
                          }  fa-star`}
                          style={{
                            color: 'gold',
                          }}
                          onClick={onFaceClick(card.id)}
                        />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          height: '100%',
                          maxWidth: '100%',
                          flexGrow: 1,
                          textAlign: 'center',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {card.title}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          height: '100%',
                          width: '8%',
                          textAlign: 'center',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {card.points}
                      </div>
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        </div>
      </>
    );
  };

  return (
    <section style={styles}>
      <section style={filtersStyles}>
        {colorOptions.map((color) => {
          return (
            <ColorButton
              key={color}
              color={color}
              active={colorFilters.includes(color)}
              onClick={toggleColor(color)}
            />
          );
        })}

        <TextInput
          style={{ width: '50vw' }}
          id="card-search"
          labelText=""
          placeholder="Search"
          onChange={onSearchInputChange}
        />
        <Button style={{ width: '50%' }} onClick={() => saveDeck()}>
          Save Deck
        </Button>
      </section>
      <section style={editorStyles}>
        <section style={collectionContainerStyles}>
          <section style={collectionWrapperStyles}>
            {renderedCollection}
          </section>
        </section>
        <section style={deckListStyles}>{renderDeckList()} </section>
      </section>
    </section>
  );
};

export default DeckBuilder;
