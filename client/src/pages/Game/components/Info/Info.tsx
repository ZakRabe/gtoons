import * as React from 'react';
import CSS from 'csstype';
import Score from '../Score';
import Hand from '../Hand';

const styles: CSS.Properties = {
  display:'inline-block',
  position:'relative',
  width:'25%',
  height:'100%',
  backgroundColor:'green'
}

export default class Info extends React.Component<{}, {}> {
  render() {
    return (
      <div style={styles}>
        <Score />
        <Hand />
      </div>
    );
  }
}
