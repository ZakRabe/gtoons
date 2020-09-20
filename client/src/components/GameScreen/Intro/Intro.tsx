import React, { useState } from 'react';
import { IntroProps } from './types';
import './shuffle.css';
import Card from '../../Card';

// Show Cut Cards
// Show Colors revealed message, 1 or 2

const Intro: React.FunctionComponent<IntroProps> = (props) => {
  const { game } = props;
  const [shuffling, setShuffling] = useState(true);
  setTimeout(() => {
    setShuffling(false);
  }, 2500);

  const renderShuffle = () => {
    return (
      <div className="stage">
        <div className="sleeve">
          <div className="wrap">
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
          </div>
        </div>
      </div>
    );
  };

  const renderCut = () => {
    return renderShuffle();
  };

  const renderHalf = (playerNumber: number) => {
    const cardKey = `p${playerNumber}CutReveal`;
    const revealedCard = game[cardKey];
    const playerKey = `player${playerNumber}`;
    const player = game[playerKey];
    const colorKey = `color${playerNumber}`;
    const otherColorKey = `color${playerNumber === 1 ? 2 : 1}`;
    // p2 color could be null
    const color = game[colorKey] || game[otherColorKey];
    return (
      <div style={{ flex: 1 }}>
        <div
          style={{
            padding: 20,
            backgroundColor: `rgba(0,198,250,.2)`,
          }}
        >
          <h3>{player.username}</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card
              model={!shuffling ? revealedCard : null}
              height={200}
              width={200}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h4>
              {!shuffling && (
                <div
                  style={{
                    margin: 8,
                    padding: '8px 12px',
                    borderRadius: 8,
                    backgroundColor: `rgba(0,198,250,.2)`,
                  }}
                >
                  <span
                    style={{
                      backgroundColor: color,
                      marginRight: '8px',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      float: 'left',
                    }}
                  ></span>
                  <span style={{ lineHeight: '36px', fontSize: 24 }}>
                    {color}
                  </span>
                </div>
              )}
            </h4>
          </div>
          {renderCut()}
        </div>
      </div>
    );
  };

  const getWinConditionText = (color1: string, color2: string) => {
    const pointColors = ['BLACK', 'SILVER'];
    const colors = [color1, color2];
    if (pointColors.includes(color1) || pointColors.includes(color2)) {
      if (pointColors.includes(color1) && pointColors.includes(color2)) {
        return (
          <>
            <p>
              Both cards revealed from the cut are BLACK or SILVER! This game
              will be decided purely by points!
            </p>
          </>
        );
      }
      const basicColor =
        color1 === 'BLACK' || color1 === 'SILVER' ? color2 : color1;
      return (
        <>
          <p>
            One of the cards revealed from the cut is BLACK or SILVER. This
            winner of this game will be determined by points.
          </p>
          <p>
            However, having more {basicColor} cards is worth a bonus of 15
            points at the end of the game.
          </p>
        </>
      );
    }
    return (
      <>
        <p>
          If a player has more cards of both colors, he or she wins
          automatically.
        </p>
        <p>
          If neither player has more of both colors, the game will be decided by
          points.
        </p>
      </>
    );
  };

  const renderInfo = () => {
    return (
      <div style={{ flex: 1 }}>
        <div className="loginWrapper" style={{ width: '100%' }}>
          <h3 style={{ textAlign: 'center' }}>
            {shuffling ? 'Shuffling...' : 'Colors Revealed!'}
          </h3>
          {shuffling ? (
            <p>Selecting cut cards</p>
          ) : (
            getWinConditionText(game.color1, game.color2)
          )}
        </div>
      </div>
    );
  };

  const render = () => {
    return (
      <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        {renderHalf(1)}
        {renderInfo()}
        {renderHalf(2)}
      </div>
    );
  };
  return render();
};

export default Intro;
