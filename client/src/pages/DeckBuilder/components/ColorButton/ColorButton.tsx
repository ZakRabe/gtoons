import * as React from 'react';
import CSS from 'csstype';
import { Button } from 'semantic-ui-react';
import { ColorButtonProps, ColorButtonState } from './types';

export default class ColorButton extends React.Component<
  ColorButtonProps,
  ColorButtonState
> {
  constructor(props: ColorButtonProps) {
    super(props);
    this.state = {
      active: true,
    };
  }

  //   toggle() {
  //     const { active } = this.state;
  //     this.setState({ active: !active });
  //   }
  render() {
    const { color, onClick } = this.props;
    const { active } = this.state;
    const backgroundColor = active ? color : 'grey';
    const filterStyle: CSS.Properties = {
      backgroundColor: backgroundColor,
      borderRadius: '50%',
      borderWidth: '1',
      borderColor: '#fff',
    };
    return <Button style={filterStyle} onClick={onClick} />;
  }
}
