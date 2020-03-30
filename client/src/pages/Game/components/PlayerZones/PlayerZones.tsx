import * as React from 'react';
import CSS from 'csstype';
import PlayerZonesRowOne from '../PlayerZonesRowOne';
import PlayerZonesRowTwo from '../PlayerZonesRowTwo';

const styles: CSS.Properties = {
  display:'block',
  position:'relative',
  width:'100%',
  height:'49%',
  marginTop:'5px',
  marginBottom:'5px',
  backgroundColor:'lightgreen'
}

const container: CSS.Properties = {
  width:'100%',
  height:'100%',
  backgroundColor:'slateblue'
}


export default class PlayerZones extends React.Component<{}, {}> {
  render() {
    let x = true;
    const renderBoard = () => {
      if(x == true){
        return <div style={container}>
          <PlayerZonesRowOne />
          <PlayerZonesRowTwo />
        </div>
      } else {
        return <div style={container}>
          <PlayerZonesRowTwo />
          <PlayerZonesRowOne />
        </div>
      }
    }
    return (
      <div style={styles}>
        {renderBoard()}
      </div>
    );
  }
}
