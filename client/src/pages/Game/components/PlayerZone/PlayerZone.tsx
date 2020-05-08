import * as React from 'react';
import CSS from 'csstype';
import { PlayerZoneProps } from './types';
import Card from '../Card';
import CardComponent from '../../../../components/Card';

const styles: CSS.Properties = {
  display: 'flex',
  flexDirection: 'row',
  width: '250px',
  height: '250px',
  borderRadius: '50%',
  margin: 'auto',
  backgroundColor: 'powderblue',
  justifyContent: 'center',
};

export default class PlayerZone extends React.Component<PlayerZoneProps, {}> {
  render() {
    const { card, onCardClick } = this.props;
    return card ? (
      <CardComponent
        model={card}
        onClick={() => {
          onCardClick(card.id);
        }}
        width={250}
        height={250}
      />
    ) : (
      <div style={styles}></div>
    );
  }
}
