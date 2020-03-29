import * as React from 'react';
import CSS from 'csstype';
import ColorCounter from '../ColorCounter'

const styles: CSS.Properties = {
  display:'block',
  width:'100%',
  height:'20%',
  backgroundColor:'lightblue'
}

export default class ColorTracker extends React.Component<{}, {}> {
  render() {
    return (
      <div style={styles}>
        <ColorCounter />
        <ColorCounter />
      </div>
    );
  }
}
