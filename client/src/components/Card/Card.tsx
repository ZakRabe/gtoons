import React from 'react';
import { CardProps } from './types';

export const Card: React.FunctionComponent<CardProps> = (props) => {
  const { model: card, onClick, onHover, width, height } = props;

  const cardWrapperStyles = {
    display: 'inline-flex',
    borderRadius: '50%',
    border: '1px solid silver',
    background: 'linear-gradient(to right, white, #030303)',
    padding: 3,
    position: 'relative' as any,
    margin: 'auto' as any,
  };
  const cardBorderStyles = {
    borderRadius: '50%',
    border: '10px solid ' + card.colors[0],
  };

  const cardStyles = {
    height,
    width,
    border: '8px inset rgba(255,255,255,.5)',
    borderRadius: '50%',
    backgroundImage: `url(/images/normal/released/${card.id}.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    cursor: onClick ? 'pointer' : 'default',
  };

  const pointStyles = {
    position: 'absolute' as any,
    bottom: '10%',
    right: '13%',
    borderRadius: '50%',
    fontSize: width / 6,
    padding: width / 15,
    width: width / 3,
    height: width / 3,
    lineHeight: `${width / 5}px`,
    backgroundColor: card.colors[0],
    color: 'white',
    textAlign: 'center' as any,
    boxSizing: 'border-box' as any,
    textShadow: '-2px -2px rgba(0,0,0,.7)',
  };

  const renderCard = () => {
    return (
      <section
        style={{ display: 'inline-flex' }}
        onClick={onClick}
        onMouseOver={onHover}
      >
        <div style={cardWrapperStyles}>
          <div style={cardBorderStyles}>
            <span style={pointStyles}>{card.points}</span>
            <div style={cardStyles}></div>
          </div>
        </div>
      </section>
    );
  };

  return renderCard();
};

export default Card;
