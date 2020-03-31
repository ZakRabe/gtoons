import * as React from 'react';
import Board from './components/Board';
import Info from './components/Info';
import CSS from 'csstype';

const styles: CSS.Properties = {
  display: 'flex',
  height: '100%',
  width: '100%'
};

export default class Game extends React.Component<{}, {}> {
  player1Name = 'Player 1';
  player2Name = 'Player 2';

  render() {
    return (
      <main style={styles}>
        <Board />
        <Info player1Name={this.player1Name} player2Name={this.player2Name} />
      </main>
    );
  }
}

//OLD LAYOUT
/*<div>
        <p>In the game</p>
        <div id="opponent">
          <div id="oField">
            <div id="oZoneOne"></div>
            <div id="oZoneTwo"></div>
            <div id="oZoneThree"></div>
            <div id="oZoneFour"></div>
            <div id="oZoneFive"></div>
            <div id="oZoneSix"></div>
            <div id="oZoneSeven"></div>
          </div>
          <div id="info">
            <div id="cardimage"></div>
            <div id="cardinfo"></div>
          </div>
        </div>
        <div id="score">
          <div id="oTracker">
            <div id="oColorCounter"></div>
            <div id="oScore"><p>0</p></div>
          </div>
          <div id="phaseTracker">
            <button id="phaseTransition">CONFIRM</button>
          </div>
          <div id="pTracker">
            <div id="pScore"><p>0</p></div>
            <div id="pColorCounter"></div>
          </div>
        </div>
        <div id="player">
          <div id="pField">
            <div id="pZoneOne"></div>
            <div id="pZoneTwo"></div>
            <div id="pZoneThree"></div>
            <div id="pZoneFour"></div>
            <div id="pZoneFive"></div>
            <div id="pZoneSix"></div>
            <div id="pZoneSeven"></div>
          </div>
          <div id="pCards">
            <div id="hand">
              <div id="hZoneOne"></div>
              <div id="hZoneTwo"></div>
              <div id="hZoneThree"></div>
              <div id="hZoneFour"></div>
              <div id="hZoneFive"></div>
              <div id="hZoneSix"></div>
            </div>
            <div id="removal">
              <div id="rZoneOne"></div>
              <div id="rZoneTwo"></div>
            </div>
          </div>
        </div>
      </div> */
