import * as React from 'react';
import CSS from 'csstype';
import HandZone from '../HandZone';
import { HandProps } from './types';

const styles: CSS.Properties = {
  display: 'block',
  width: '100%',
  height: '70%',
  backgroundColor: 'blue',
  overflow: 'hidden',
};

export default class Hand extends React.Component<HandProps, {}> {
  render() {
    const { cards } = this.props;
    return (
      <div style={styles}>
        {cards.map((card) => {
          return <HandZone card={card} />;
        })}
      </div>
    );
  }
}
