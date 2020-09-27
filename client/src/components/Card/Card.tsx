import { isEqual } from 'lodash';
import React from 'react';
import './styles.scss';
import { CardProps } from './types';
import CopyToClipboard from 'react-copy-to-clipboard';

export const Card: React.FunctionComponent<CardProps> = (props) => {
  const { model, onClick, onHover, width, height } = props;
  const [isHovering, setIsHovering] = React.useState(false);

  const card = model || {
    id: 'default',
    colors: ['SILVER'],
    points: 0,
  };

  const colorToGradient = (color: string): string[] => {
    if (color === 'BLACK') {
      return ['#46535E', '#020203'];
    }

    if (color === 'BLUE') {
      return ['#04BDFC', '#007AC0'];
    }

    if (color === 'GREEN') {
      return ['#00FB1F', '#009812'];
    }

    if (color === 'ORANGE') {
      return ['#FBA419', '#D6720C'];
    }

    if (color === 'PURPLE') {
      return ['#E542FC', '#AB0ABE'];
    }

    if (color === 'SILVER') {
      return ['#D7E6E8', '#A4BFC9'];
    }

    if (color === 'YELLOW') {
      return ['#F2FD0A', '#E2C701'];
    }

    return ['fff', 'fff'];
  };

  const [gradientColorLight, gradientColorDark] = colorToGradient(card.colors[0]);

  const handleOnMouseEnter = (e: any) => {
    onHover && onHover(e);
    setIsHovering(true);
  }

  const handleOnMouseLeave = (e: any) => {
    setIsHovering(false);
  }

  const renderHover = () => (
    <div className={`info${isHovering ? ' show' : ''}`}>
      <div className='header'>
        <div className="title">
          <strong>{card.title}</strong>
          <CopyToClipboard text={card.id.toString()}>
            <span className="debug">id: {card.id}</span>
          </CopyToClipboard>
        </div>
        <span>{card.description}</span>
      </div>
      <table>
        <tbody>
          <tr style={{}}>
            <td>Character</td>
            <td>{card.character}</td>
          </tr>
          <tr style={{}}>
            <td>Types</td>
            <td>
              {card.types.join(', ')}
            </td>
          </tr>
          <tr style={{}}>
            <td>Groups</td>
            <td>
              {card.groups.join(', ')}
            </td>
          </tr>
          <tr style={{}}>
            <td>Base Points</td>
            <td>{card.basePoints}</td>
          </tr>
        </tbody>
      </table>
      {card.modifiers?.length > 0 && (
        <div className='modifiers'>
          <span>Modifiers</span>
          {card.modifiers?.map((mod) => 
            <pre><code>{JSON.stringify(mod, null, 2)}</code></pre>
          )}
        </div>
      )}
    </div>
  );

  const renderCardSVG = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="200"
      height="200"
      viewBox="0 0 200 200"
    >
      <defs>
        <linearGradient
          id={`a${card.id}`}
          y1="0.5"
          x2="1"
          y2="0.5"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stop-color="#44759a" />
          <stop offset="1" stop-color="#345f85" />
        </linearGradient>
        <radialGradient
          id={`b${card.id}`}
          cx="0.5"
          cy="0.5"
          r="0.477"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stop-color="#eef4f8" />
          <stop offset="0.948" stop-color="#eef4f8" />
          <stop offset="1" stop-color="#b1cdde" />
        </radialGradient>
        <linearGradient
          id={`d${card.id}`}
          x1="0.885"
          y1="0.816"
          x2="0.069"
          y2="0.231"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stop-color={gradientColorLight} />
          <stop offset="1" stop-color={gradientColorDark} />
        </linearGradient>
        <clipPath id={`e${card.id}`}>
          <circle
            cx="74"
            cy="74"
            r="74"
            transform="translate(779 297)"
            fill="#fff"
          />
        </clipPath>
        <linearGradient
          id={`f${card.id}`}
          x1="0.885"
          y1="0.816"
          x2="-0.525"
          y2="-0.292"
          href={`#d${card.id}`}
        />
      </defs>
      <circle cx="100" cy="100" r="100" fill={`url(#a${card.id})`} />
      <circle
        cx="99"
        cy="99"
        r="99"
        transform="translate(1 1)"
        fill={`url(#b${card.id})`}
      />
      <circle
        cx="88"
        cy="88"
        r="88"
        transform="translate(12 12)"
        fill={`url(#a${card.id})`}
      />
      <g
        transform="translate(14 14)"
        fill="#afd2e3"
        stroke="#a0b4c0"
        stroke-width="2"
      >
        <circle cx="86" cy="86" r="86" stroke="none" />
        <circle cx="86" cy="86" r="85" fill="none" />
      </g>
      <circle
        cx="78"
        cy="78"
        r="78"
        transform="translate(22 22)"
        fill={`url(#d${card.id})`}
      />
      <g transform="translate(-753 -271)" clip-path={`url(#e${card.id})`}>
        <image
          preserveAspectRatio="xMidYMid slice"
          width="148"
          height="218"
          transform="translate(779 271)"
          href={`/images/normal/released/${card.id}.jpg`}
        />
      </g>
      <g
        transform="translate(113 111)"
        fill="#fff"
        stroke="#afd2e3"
        stroke-width="4"
      >
        <circle cx="26" cy="26" r="26" stroke="none" />
        <circle cx="26" cy="26" r="24" fill="none" />
      </g>
      <g
        transform="translate(116 114)"
        stroke="#8b9aa4"
        stroke-width="1"
        fill={`url(#f${card.id})`}
      >
        <circle cx="23" cy="23" r="23" stroke="none" />
        <circle cx="23" cy="23" r="22.5" fill="none" />
      </g>
      <text
        transform={`translate(${card.points > 9 ? '118' : '128'} 149)`}
        fill="#afd2e3"
        stroke="#8b9aa4"
        stroke-width="1"
        font-size="30"
        font-family="Verdana-BoldItalic, Verdana"
        font-weight="700"
        font-style="italic"
        textLength="40"
      >
        {card.points}
      </text>
      <path
        d="M.144,146.983h0C.048,145.334,0,143.657,0,142A85.6,85.6,0,0,1,14.688,93.917,86.252,86.252,0,0,1,52.525,62.758,85.462,85.462,0,0,1,86,56h.47A86.1,86.1,0,0,0,50.025,73.863,85.841,85.841,0,0,0,.144,146.983Z"
        transform="translate(18 -39)"
        fill="#f9f9f9"
        opacity="0.67"
      />
    </svg>
  );

  return (
    <div
      className={`card-wrapper${card.disabled ? ' disabled' : ''}`}
      onClick={onClick}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {renderHover()}
      {renderCardSVG()}
    </div>
  );
};

export default React.memo(Card, isEqual);

// Todo

// High:
// add dynamic positioning of info box (hover) for cards at the bottom
// check when `if (!model)` and if it should be replaced with this image inside the new svg wrapper

// Medium:

// Low:
// decide how to handle multicolored cards (when `card.colors.length is > 1`) - currently we're using `card.colors[0]`
// extract `colorToGradient` to a helpers file and also create a dictionary of color constants
