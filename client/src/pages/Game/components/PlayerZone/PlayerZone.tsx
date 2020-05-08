import * as React from 'react';
import CSS from 'csstype';
import { PlayerZoneProps } from './types';
import Card from '../Card';
import CardComponent from '../../../../components/Card';

const styles: CSS.Properties = {
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 0.2,
  height: '95%',
  margin: '5px',
  borderRadius: '50%',
  backgroundColor: 'powderblue',
  justifyContent: 'center',
};

export default class PlayerZone extends React.Component<PlayerZoneProps, {}> {
  render() {
    const { card, onCardClick } = this.props;
    return card ? (
      <div style={styles}>
        <CardComponent
          model={card}
          onClick={() => {
            onCardClick(card.id);
          }}
          width={250}
          height={250}
        />
      </div>
    ) : (
      <div style={styles}></div>
    );
  }
}
