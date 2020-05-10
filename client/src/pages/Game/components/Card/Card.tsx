import * as React from 'react';
import CSS from 'csstype';
import { CardProps } from './types';

// UNUSED ATM

export default class Card extends React.Component<CardProps, {}> {
  getImageURL() {
    const { useAnimated, cardID } = this.props;
    const normal = 'standard';
    const animated = 'animated';

    const folder = useAnimated ? 'animated' : 'normal';
    const extension = useAnimated ? 'gif' : 'jpg';

    const imageURL = `/images/${folder}/released/${cardID}.${extension}`;

    return imageURL;
  }

  getCardStyle() {
    const { cardColor } = this.props;

    const container: CSS.Properties = {
      userSelect: 'none',
      position: 'absolute',
      width: '88%',
      height: '88%',
      margin: '0',
      backgroundImage: `url(${this.getImageURL()})`,
      border: '11px solid ' + cardColor,
      borderRadius: '50%',
      backgroundSize: 'cover',
    };

    return container;
  }

  render() {
    const { cardColor, cardScore } = this.props;

    return (
      <div style={this.getCardStyle()}>
        <div
          style={{
            userSelect: 'none',
            margin: '7px',
            height: '50px',
            width: '50px',
            borderRadius: '50%',
            backgroundColor: cardColor,
          }}
        >
          <p
            style={{
              userSelect: 'none',
              textAlign: 'center',
              color: 'white',
              margin: '0',
              paddingTop: '5px',
              fontSize: '25pt',
              fontWeight: 'bold',
            }}
          >
            {cardScore}
          </p>
        </div>
      </div>
    );
  }
}
