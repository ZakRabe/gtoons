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
    const { card, slot, onCardClick,onEmptyClick} = this.props;

    const zoneEnabled = true;

    const renderEmpty = (enabled: boolean) =>
    enabled ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="214"
        height="214"
        viewBox="0 0 214 214"
        onClick={()=>{onEmptyClick(slot)}}
      >
        <defs>
          <radialGradient
            id={`a${card?.id}-emptyEnabled`}
            cx="0.659"
            cy="0.688"
            r="0.74"
            gradientTransform="matrix(1, 0.023, -0.023, 1.025, 0.016, -0.032)"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stop-color="#7897b3" />
            <stop offset="0.378" stop-color="#6a89a0" />
            <stop offset="1" stop-color="#1E3638" />
          </radialGradient>
        </defs>
        <g fill="none" stroke="#99bcd1" stroke-width="4">
          <circle cx="107" cy="107" r="107" stroke="none" />
          <circle cx="107" cy="107" r="105" fill="none" />
        </g>
        <g
          transform="translate(7 7)"
          fill="none"
          stroke="#d1fbff"
          stroke-width="8"
        >
          <circle cx="100" cy="100" r="100" stroke="none" />
          <circle cx="100" cy="100" r="96" fill="none" />
        </g>
        <circle
          cx="92"
          cy="92"
          r="92"
          transform="translate(15 15)"
          fill={`url(#a${card?.id}-emptyEnabled)`}
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="214"
        height="214"
        viewBox="0 0 214 214"
      >
        <g fill="none" stroke="#99bcd1" stroke-width="4" opacity="0.5">
          <circle cx="107" cy="107" r="107" stroke="none" />
          <circle cx="107" cy="107" r="105" fill="none" />
        </g>
        <g
          transform="translate(7 7)"
          fill="#7897b3"
          stroke="#99bcd1"
          stroke-width="8"
          opacity="0.5"
        >
          <circle cx="100" cy="100" r="100" stroke="none" />
          <circle cx="100" cy="100" r="96" fill="none" />
        </g>
      </svg>
    );

    return (
      <div style={styles}>
        {card?
        <Card model={card}
        height={100} 
        width={100}
        onClick={()=>{onCardClick(card.id, slot)}}></Card>:
        renderEmpty(zoneEnabled)
        }
      </div>
    );
  }
}
