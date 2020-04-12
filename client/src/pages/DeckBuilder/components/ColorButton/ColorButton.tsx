import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { ColorButtonProps } from './types';

export default class ColorButton extends React.Component<ColorButtonProps, {}> {
  //   toggle() {
  //     const { active } = this.state;
  //     this.setState({ active: !active });
  //   }
  render() {
    const { color, onClick, active } = this.props;
    const backgroundColor = color;
    const wrapperStyles: React.CSSProperties = {
      boxShadow: '0px 0px 5px white',
      borderRadius: '50%',
      borderWidth: '1',
      borderColor: '#fff',
      marginRight: 5,
      height: 35,
      width: 35,
      display: 'inline-block',
    };
    const filterStyle: React.CSSProperties = {
      backgroundColor: backgroundColor,
      opacity: active ? 1 : 0.3,
      borderRadius: '50%',
      height: '100%',
      width: '100%',
    };
    return (
      <span style={wrapperStyles}>
        <button style={filterStyle} onClick={onClick} />
      </span>
    );
  }
}
