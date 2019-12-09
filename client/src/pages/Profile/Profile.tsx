import * as React from "react";
import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';

class Profile extends React.Component<{ socket: any }, { cards: string[] }>{

  constructor(props: any) {
    super(props);
    this.state = { cards: [] }
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    // fetch('/api/cards')
    //   .then(res => res.json())
    //   .then(cards => this.setState({ cards }))
  }

  sendSocketMessage = () => {
    const { socket } = this.props;
    socket.emit('message', "hello world")
    socket.on('message', (msg: any) => console.log)
  }

  render() {
    const { cards } = this.state

    return <div>
      <h2>Profile</h2>
      <button onClick={this.sendSocketMessage}>
        Hello World to the server
      </button>
      <ul>
        {
          cards.length ? cards.map(card => <li key={card}>{card}</li>) : <li>No cards found</li>
        }
      </ul>


    </div>
  }
}

export default socketConnect(Profile)