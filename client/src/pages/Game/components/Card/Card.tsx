import * as React from 'react';
import CSS from 'csstype';
import { CardProps } from './types';

const styles: CSS.Properties = {
  position: 'absolute',
  top: '5px',
  bottom: '5px',
  left: '5px',
  right: '5px',
  backgroundColor: 'red'
};

export default class Card extends React.Component<CardProps, {}> {
  render() {
    const { cardID,cardColor } = this.props;

    return (
      <div style={styles}>
        <img style={{ width: '100%',height:'100%',border:'10px solid orange',borderRadius:'50%' }} src={"/images/"+ cardID + ".gif"} />
      </div>
    );
  }
}
