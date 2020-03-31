import * as React from 'react';
import CSS from 'csstype';
import HandZone from '../HandZone';

const styles: CSS.Properties = {
  display:'block',
  width:'100%',
  height:'70%',
  backgroundColor:'blue',
  overflow:'hidden'
}

export default class Hand extends React.Component<{}, {}> {
  render() {
    return (
      <div style={styles}>
        <HandZone />
        <HandZone />
        <HandZone />
        <HandZone />
        <HandZone />
        <HandZone />
      </div>
    );
  }
}
