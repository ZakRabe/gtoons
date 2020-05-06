import * as React from 'react';
import { SandboxProps } from './types';
import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';
import { Button, Input, Dropdown, DropdownItemProps } from 'semantic-ui-react';
import { request } from '../../utils/api';
import { Card, Deck } from '../../App/types';
import CardComponent from '../../components/Card';
import CSS from 'csstype';
import ColorButton from './components/ColorButton';
import Board from '../Game/components/Board';

export const Sandbox = (props: SandboxProps) => {
  // const { socket } = props;

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
  const [cards, setCards] = React.useState<Card[]>([]);
  const [name, setName] = React.useState('New Deck');

  const [deckId, setDeckId] = React.useState(-1);
  const [deck, setDeck] = React.useState<number[]>([]);
  const [deckList, setDeckList] = React.useState<Deck[]>([]); // probably don't need this anymore?
  const [deckListOptions, setDeckListOptions] = React.useState<
    DropdownItemProps[]
  >([]);

  // display a list of decks
  // Click a card in the collection -> adds it to the current deck
  // Click a card in the deck       -> removes it from the deck
  // save the deck
  // delete the deck
  // Name a deck

  const styles: CSS.Properties = {
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

  const boardStyle = {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative' as any,
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
      const localDeckList = [...newDeckList];
      setDeckList(localDeckList);
      // console.log(t);
      updateOptions(localDeckList);

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

  const onDeckClick = (clickedDeck: Deck) => () => {
    // console.log(clickedDeck);
    const { id, name } = clickedDeck;
    const savedDeck = JSON.parse(clickedDeck.cards);
    // console.log(savedDeck);
    setDeckId(id);
    setDeck(savedDeck);
    setName(name);
  };

  const onDeckCardClick = (cardId: number) => (e: React.MouseEvent) => {
    // console.log(e);
    // console.log(cardId);

    const newDeck = [...deck].filter((id) => id !== cardId);
    setDeck(newDeck);
  };

  //TODO: Rename
  const updateOptions = (deckList: Deck[]) => {
    const listOptions: DropdownItemProps[] = [];
    // console.log(deckList);
    deckList.map((deck) => {
      // console.log(deck);
      listOptions.push({
        key: deck.id.toString(),
        text: deck.name,
        value: deck.id,
        onClick: onDeckClick(deck),
      });
    });
    // console.log(listOptions);
    setDeckListOptions(listOptions);
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
    return attr.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const checkForTerm = (card: Card, searchTerm: string): boolean => {
    const fields = [
      card.title,
      card.character,
      card.description,
      ...card.groups,
      ...card.types,
    ];

    // dont match on points for examples like "+8"
    const isPointMatch =
      card.points === Number(searchTerm) && !searchTerm.includes('+');

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
    console.log('filterByColor');
    return cards.filter((card: Card) =>
      card.colors.some((cardColor) => activeColors.includes(cardColor))
    );
  };

  const filterBySearchTerm = (cards: Card[], searchTerm: string): Card[] => {
    console.log('filterBySearchTerm');
    if (!searchTerm.length) {
      return cards;
    }
    return cards.filter((card) => checkForTerm(card, searchTerm));
  };

  const colorMatches = React.useMemo(() => filterByColor(cards, colorFilters), [
    cards,
    colorFilters,
  ]);

  const searchMatches = React.useMemo(() => filterBySearchTerm(cards, search), [
    cards,
    search,
  ]);

  const allMatches = React.useMemo(
    () =>
      cards
        .filter((card) => searchMatches.includes(card))
        .filter((card) => colorMatches.includes(card)),
    [cards, colorFilters, search]
  );

  const renderBoard = () => {
    return <Board />;
  };

  const renderCardList = () => {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'white',
              flexDirection: 'column',
              textAlign: 'center',
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
                const card =
                  cards.find((item: Card) => item.id === cardId) as Card;
                return card ? (
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
                ) : null;
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
              color={color}
              active={colorFilters.includes(color)}
              onClick={toggleColor(color)}
            />
          );
        })}

        <Input
          icon="search"
          placeholder="Search"
          onChange={onSearchInputChange}
          style={{ flexGrow: '1', marginRight: 10 }}
        ></Input>
      </section>
      <section style={editorStyles}>
        <section style={boardStyle}>{renderBoard()}</section>
        <section style={deckListStyles}>{renderCardList()} </section>
      </section>
    </section>
  );
};

export default Sandbox;
