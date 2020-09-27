import * as React from 'react';
import CSS from 'csstype';
import PlayerZone from '../PlayerZone';
import { CardRowProps } from '../PlayerZonesRowOne/types';

const styles: CSS.Properties = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  height: '50%',
  backgroundColor: 'tomato',
};

export default class PlayerZonesRowTwo extends React.Component<
  CardRowProps,
  {}
> {
  render() {
    const { cards, onCardClick, onCardHover } = this.props;
    return (
      <div style={styles}>
        {cards?.map((card, index) => {
          return (
            <PlayerZone
              key={`boardSlot_row2_${index}`}
              card={card}
              onCardClick={onCardClick}
              onCardHover={onCardHover}
            />
          );
        })}
      </div>
    );
  }
}
