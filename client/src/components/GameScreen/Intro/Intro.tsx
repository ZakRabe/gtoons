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
    return (
      <div style={{ flex: 1, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Card
            model={!shuffling ? game[cardKey] : null}
            height={200}
            width={200}
          />
        </div>
        {renderCut()}
      </div>
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
            <>
              <p>
                If a player has more cards of both colors, he or she wins
                automatically.
              </p>
              <p>
                If neither player has more of both colors, the game will be
                decided by points.
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  const render = () => {
    return (
      <>
        {renderHalf(1)}
        {renderInfo()}
        {renderHalf(2)}
      </>
    );
  };
  return render();
};

export default Intro;
