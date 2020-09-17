import * as React from 'react';
import { SandboxProps } from './types';
import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';
import { Input } from 'semantic-ui-react';
import { request } from '../../utils/api';
import { Card } from '../../App/types';
import CardComponent from '../../components/Card';
import CSS from 'csstype';
import ColorButton from './components/ColorButton';
import PlayerZones from '../Game/components/PlayerZones';
import { Dictionary, debounce } from 'lodash';

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

  const [colorFilters, setFilters] = React.useState(colorOptions);
  const [search, setSearch] = React.useState('');
  const [hoveredCard, setHoveredCard] = React.useState<Card | null>(null);
  const [cards, setCards] = React.useState<Card[]>([]);
  const [board, setBoard] = React.useState<(Card | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

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

  const cardListStyles = {
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

  React.useEffect(() => {
    request({ url: 'cards/all' }).then(setCards);
  }, []);

  const calculateScore = () => {
    request({
      method: 'post',
      url: 'sandbox/calculateScore',
      data: { board: board.map((card) => (card ? card.id : null)) },
    }).then((results) => {
      console.log(results);
    });
  };

  React.useEffect(() => {
    calculateScore();
  }, [board]);

  const onCollectionCardClick = (cardId: number) => (e: React.MouseEvent) => {
    const newBoard = [...board];

    const emptySpace = newBoard.findIndex((card) => card === null);
    const card = cards.find((item: Card) => item.id === cardId) as Card;

    if (
      newBoard.find((card) => card && card.id === cardId) ||
      emptySpace === -1
    ) {
      return;
    }

    newBoard.splice(emptySpace, 1, card);
    setBoard(newBoard);
  };

  const removeCard = (cardId: number) => {
    const newBoard = [...board];
    const index = newBoard.findIndex((card) => card && card.id === cardId);

    newBoard.splice(index, 1, null);

    setBoard(newBoard);
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
    return (
      <PlayerZones
        cards={board}
        onCardClick={removeCard}
        onCardHover={onHover}
      />
    );
  };

  const hoveredCardUi = () => (
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
  );

  const collectionUi = () => (
    <div style={collectionContainerStyles}>
      <div style={collectionWrapperStyles}>
        <ul
          style={{
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            padding: 0,
          }}
        >
          {allMatches.map((card) => {
            return (
              <li
                key={card.id}
                onClick={onCollectionCardClick(card.id)}
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
            );
          })}
        </ul>
      </div>
    </div>
  );

  const renderCardList = () => {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {hoveredCardUi()}
          {collectionUi()}
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

        <Input
          icon="search"
          placeholder="Search"
          onChange={onSearchInputChange}
          style={{ flexGrow: '1', marginRight: 10 }}
        ></Input>
      </section>
      <section style={editorStyles}>
        <section style={boardStyle}>{renderBoard()}</section>
        <section style={cardListStyles}>{renderCardList()} </section>
      </section>
    </section>
  );
};

export default Sandbox;
