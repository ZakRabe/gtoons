import * as React from 'react';
import CSS from 'csstype';
import Card from '../../../../components/Card';
import { HandZoneProps } from './types';

const styles: CSS.Properties = {
  display: 'inline-block',
  position: 'relative',
  width: '48%',
  height: '31%',
  marginTop: '5px',
  marginLeft: '5px',
  backgroundColor: 'yellow',
};

export default class HandZone extends React.Component<HandZoneProps, {}> {
  render() {
    const { card } = this.props;
    return (
      <div style={styles}>
        <Card height={100} width={100} model={card}></Card>
      </div>
    );
  }
}
