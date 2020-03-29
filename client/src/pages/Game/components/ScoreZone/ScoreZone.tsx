import * as React from 'react';
import CSS from 'csstype';
import ColorTracker from '../ColorTracker';

const styles: CSS.Properties = {
  display:'inline-block',
  width:'48%',
  height:'96%',
  marginTop:'5px',
  marginBottom:'5px',
  marginLeft:'5px',
  backgroundColor:'pink'
}

const scoreStyle: CSS.Properties = {
  height:'73%'
}

const playerName: CSS.Properties = {
  textAlign:'center'
}

const score: CSS.Properties = {
  fontSize:'75px',
  textAlign:'center',
  margin:'0'
}

export default class ScoreZone extends React.Component<{}, {}> {
  render() {
    return (
      <div style={styles}>
        <div style={scoreStyle}>
          <p style={playerName}>PLAYER NAME</p>
          <p style={score}>50</p>
        </div>
        <ColorTracker />
      </div>
    );
  }
}
