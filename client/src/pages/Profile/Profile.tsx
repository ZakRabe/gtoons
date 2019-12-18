import * as React from 'react';
import {
  socketConnect
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
      <div>
        <h2>Profile</h2>
        <button onClick={this.sendSocketMessage}>
          Hello World to the server
        </button>
      </div>
    );
  }
}

export default socketConnect(Profile);
