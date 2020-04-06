import * as React from 'react';
import CSS from 'csstype';

const styles: CSS.Properties = {
  display: 'inline-block',
  width: '50%',
  height: '100%',
  backgroundColor: 'orange',
};

const countStyle: CSS.Properties = {
  fontSize: '20px',
  background: 'violet',
  display: 'inline-block',
  width: '40%',
  height: '100%',
  margin: '0',
  padding: '0',
};

const colorStyle: CSS.Properties = {
  display: 'inline-block',
  background: 'steelblue',
  width: '55%',
  height: '100%',
};

export default class ColorCounter extends React.Component<{}, {}> {
  render() {
    return (
      <div style={styles}>
        <div style={countStyle}></div>
        <div style={colorStyle}></div>
      </div>
    );
  }
}
