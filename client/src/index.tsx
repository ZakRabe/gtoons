import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import io from 'socket.io-client';
// @ts-ignore: no types for this
import { SocketProvider } from 'socket.io-react';
import App from './App/App';
import './index.css';

const socket = io.connect({ port: '5000' }); // Transports option broke websockets
socket.on('message', (msg: any) => console.log(msg));

ReactDOM.render(
  <SocketProvider socket={socket}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SocketProvider>,
  document.getElementById('root')
);
