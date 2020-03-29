import * as React from 'react';
import CSS from 'csstype';
import ScoreZone from '../ScoreZone';

const styles: CSS.Properties = {
  display:'block',
  width:'100%',
  height:'30%',
  backgroundColor:'purple'
}

export default class Score extends React.Component<{}, {}> {
  render() {
    return (
      <div style={styles}>
        <ScoreZone />
        <ScoreZone />
      </div>
    );
  }
}
