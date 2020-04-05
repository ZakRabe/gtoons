import * as React from 'react';
import { Header } from 'semantic-ui-react';
import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';

class Profile extends React.Component<{ socket: any }, {}> {
  componentDidMount() {}

  sendSocketMessage = () => {
    const { socket } = this.props;
    socket.emit('message', 'hello world');
    socket.on('message', (msg: any) => console.log);
  };

  render() {
    return (
      <>
        <Header as="h1">Profile</Header>
        <button onClick={this.sendSocketMessage}>
          Hello World to the server
        </button>
      </>
    );
  }
}

export default socketConnect(Profile);
