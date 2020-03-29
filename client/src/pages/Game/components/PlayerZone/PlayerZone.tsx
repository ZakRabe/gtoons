import * as React from 'react';
import CSS from 'csstype';

const styles: CSS.Properties = {
  display:'block',
  position:'relative',
  width:'100%',
  height:'49%',
  marginTop:'5px',
  marginBottom:'5px',
  backgroundColor:'lightgreen'
}

export default class PlayerZone extends React.Component<{}, {}> {
  render() {
    return (
      <div style={styles}>
      </div>
    );
  }
}
