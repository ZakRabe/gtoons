import React from 'react';
import { CardProps } from './types';

export const Card: React.FunctionComponent<CardProps> = (props) => {
  const { model: card, onClick, onHover, width, height } = props;

  const cardWrapperStyles = {
    display: 'inline-flex',
    margin: '7px',
    borderRadius: '50%',
    border: '1px solid silver',
    background: 'linear-gradient(to right, white, #030303)',
    padding: 3,
  };
  const cardBorderStyles = {
    borderRadius: '50%',
    border: '10px solid ' + card.colors[0],
  };

  const cardStyles = {
    height,
    width,
    border: '10px inset rgba(255,255,255,.5)',
    borderRadius: '50%',
    backgroundImage: `url(/images/normal/released/${card.id}.jpg)`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    cursor: onClick ? 'pointer' : 'default',
  };

  const renderCard = () => {
    return (
      <section>
        <div onClick={onClick} onMouseOver={onHover}>
          <div style={cardWrapperStyles}>
            <div style={cardBorderStyles}>
              <div style={cardStyles}></div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return renderCard();
};

export default Card;
