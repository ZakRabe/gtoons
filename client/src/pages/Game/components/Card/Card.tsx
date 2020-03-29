import * as React from 'react';
import CSS from 'csstype';

const styles: CSS.Properties = {
  position:'absolute',
  top:'5px',
  bottom:'5px',
  left:'5px',
  right:'5px',
  backgroundColor:'red'
}

export default class Card extends React.Component<{}, {}> {
  render() {
    return (
      <div style={styles}>
      </div>
    );
  }
}
