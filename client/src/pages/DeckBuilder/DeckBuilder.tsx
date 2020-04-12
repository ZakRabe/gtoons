import * as React from 'react';
import { DeckBuilderProps } from './types';
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

export const DeckBuilder = (props: DeckBuilderProps) => {
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
  const [deckList, setDeckList] = React.useState<Deck[]>([]);
  const [deckListOptions, setDeckListOptions] = React.useState<
    DropdownItemProps[]
  >([{ key: 'new', text: 'New Deck', value: 'New Deck' }]);

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
      // console.log(t);
      handleChange(t);

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

  const saveDeck = () => {
    if (deck.length !== 12) {
      // console.log('not enough cards in you deck');
      // console.log(deck.length);
      return;
    }

    request({
      method: 'post',
      url: 'deckBuilder/saveDeck',
      data: { name, deck },
    }).then((newDeck: Deck) => {
      const newDeckList: Deck[] = [...deckList];
      newDeckList.push(newDeck);
      setDeckId(newDeck.id);
      setName(newDeck.name);
      setDeck(JSON.parse(newDeck.cards));
      setDeckList(newDeckList);
    });
  };

  const updateDeck = () => {
    request({
      method: 'post',
      url: 'deckBuilder/updateDeck',
      data: { deckId, name, deck },
    }).then((newDeck: Deck) => {
      //update copy on the page
      const newDeckList = [
        ...deckList.filter((deck) => deck.id !== newDeck.id),
        newDeck,
      ];
      // console.log(newDeckList);
      setDeckList(newDeckList);
    });
  };

  //TODO: Rename
  const handleChange = (deckList: Deck[]) => {
    const listOptions: DropdownItemProps[] = [];
    listOptions.push({
      key: 'newDeck',
      text: 'New Deck',
      value: '-1',
    });
    // console.log(deckList);
    deckList.map((deck) => {
      // console.log(deck);
      listOptions.push({
        key: deck.id.toString(),
        text: deck.name,
        value: deck.id,
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

  const renderDeckList = () => {
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
          <div style={{ display: 'flex' }}>
            <Input
              name="name"
              value={name}
              onChange={onNameInputChange}
              style={{ width: '100%' }}
              action={
                <Dropdown
                  button
                  basic
                  options={deckListOptions}
                  style={{ display: 'flex', width: '20%' }}
                />
              }
            />
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
                  >
                    {card.title}
                  </li>
                ) : null;
              })}
            </ul>
          </div>
          <div>
            <Button style={{ width: '50%' }} onClick={() => saveDeck()}>
              SAVE DECK
            </Button>
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
        ></Input>
      </section>
      <section style={editorStyles}>
        <section style={collectionContainerStyles}>
          <section style={collectionWrapperStyles}>
            {renderCollection()}
          </section>
        </section>
        <section style={deckListStyles}>{renderDeckList()} </section>
      </section>
    </section>
  );
};

export default DeckBuilder;
