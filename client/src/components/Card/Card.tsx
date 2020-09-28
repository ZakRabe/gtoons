import { isEqual } from 'lodash';
import React from 'react';

import { CardProps } from './types';
import CopyToClipboard from 'react-copy-to-clipboard';

export const Card: React.FunctionComponent<CardProps> = (props) => {
  const { model, onClick, onHover, width, height } = props;

  const [isHovering, setIsHovering] = React.useState(false);

  if (!model) {
    return (
      <img
        width={width + 25}
        height={height + 25}
        style={{ margin: 0 }}
        src="/images/normal/released/default.png"
      ></img>
    );
  }

  const card = model || {
    id: 'default',
    colors: ['SILVER'],
    points: 0,
  };

  const cardWrapperStyles = {
    display: 'inline-flex',
    borderRadius: '50%',
    border: '1px solid silver',
    background: 'linear-gradient(to right, white, #030303)',
    padding: 3,
    position: 'relative' as any,
    margin: 'auto' as any,
    cursor: onClick ? 'pointer' : 'default',
  };
  const cardBorderStyles = {
    borderRadius: '50%',
    border: '10px solid ' + card.colors[0],
    position: 'relative' as 'relative', // ??
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
    opacity: card.disabled ? 0.25 : 1,
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

  const tableCellStyles = {
    padding: 3,
  };

  const renderCard = () => {
    return (
      <section
        style={{
          display: 'inline-flex',
          userSelect: 'none',
          position: 'relative',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        onMouseEnter={(e) => {
          onHover && onHover(e);
          setIsHovering(true);
        }}
        onMouseLeave={(e) => setIsHovering(false)}
      >
        <CopyToClipboard text={card.id.toString()}>
          <div
            style={{
              cursor: 'pointer',
              position: 'absolute',
              bottom: '20%',
              left: '8%',
              fontSize: 16,
              padding: 3,
              background: 'white',
            }}
          >
            <span>{card.id}</span>
          </div>
        </CopyToClipboard>
        <div style={cardWrapperStyles} onClick={onClick}>
          <div style={cardBorderStyles}>
            <span style={pointStyles}>{card.points}</span>
            <div
              style={{
                display: isHovering ? 'block' : 'none',
                position: 'absolute',
                backgroundColor: 'white',
                padding: 3,
              }}
            >
              <div>
                <strong>{card.title}</strong>
              </div>
              <div>{card.description}</div>
              <table
                style={{
                  borderTop: '3px solid rgba(0,0,0,.5)',
                  borderBottom: '3px solid rgba(0,0,0,.5)',
                }}
              >
                <tbody>
                  <tr style={{}}>
                    <td style={{ padding: 3 }}>Character</td>
                    <td style={{ padding: 3, paddingLeft: 6 }}>
                      {card.character}
                    </td>
                  </tr>

                  <tr style={{}}>
                    <td style={{ padding: 3 }}>Types</td>
                    <td style={{ padding: 3, paddingLeft: 6 }}>
                      {card.types.join(' - ')}
                    </td>
                  </tr>
                  <tr style={{}}>
                    <td style={{ padding: 3 }}>Groups</td>
                    <td style={{ padding: 3, paddingLeft: 6 }}>
                      {card.groups.join(' - ')}
                    </td>
                  </tr>
                  <tr style={{}}>
                    <td style={{ padding: 3 }}>Base Points</td>
                    <td style={{ padding: 3, paddingLeft: 6 }}>
                      {card.basePoints}
                    </td>
                  </tr>
                </tbody>
              </table>

              {card.modifiers?.map((mod) => {
                return <div>{JSON.stringify(mod)}</div>;
              })}
            </div>
            <div style={cardStyles}></div>
          </div>
        </div>
      </section>
    );
  };

  return renderCard();
};

export default React.memo(Card, isEqual);
