import * as React from 'react';
import CSS from 'csstype';

const styles: CSS.Properties = {
  display:'inline-block',
  position:'relative',
  width:'20%',
  height:'95%',
  marginTop:'5px',
  marginBottom:'5px',
  marginLeft:'25px',
  backgroundColor:'powderblue'
}


export default class PlayerZone extends React.Component<{}, {}> {
  render() {
    return (
      <div style={styles}>
      </div>
    );
  }
}
