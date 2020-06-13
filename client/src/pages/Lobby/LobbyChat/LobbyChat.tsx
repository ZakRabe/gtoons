import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LobbyChatProps, ChatMessage } from './types';
import { Header, Input, Button } from 'semantic-ui-react';
import { isLoggedIn } from '../../../utils/auth';

const LobbyChat: React.FunctionComponent<LobbyChatProps> = (props) => {
  const { socket, lobbyId } = props;

  const wrapperStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    width: '20vw',
  };

  const messagesStyles: React.CSSProperties = {
    flex: 1,
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,.5)',
  };

  const scrollStyles: React.CSSProperties = {
    position: 'absolute',
    padding: 8,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'auto',
  };

  const [message, setMessage] = useState('');
  const messagesRef = useRef<ChatMessage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addChatMessage = (newMessage: ChatMessage) => {
    const newMessages = [...messagesRef.current];

    if (newMessages.length === 50) {
      newMessages.shift();
    }

    newMessages.push(newMessage);
    setMessages(newMessages);
  };

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on('userJoined', (newUsername: string) => {
        addChatMessage({
          message: `${newUsername} has joined the Lobby`,
          username: 'System',
        });
      });
      socket.on('userLeft', (newUsername: string) => {
        addChatMessage({
          message: `${newUsername} has left the Lobby`,
          username: 'System',
        });
      });

      socket.on('newMessage', addChatMessage);
    }

    return () => {
      if (socket) {
        socket.off('userJoined');
        socket.off('userLeft');
        socket.off('newMessage');
      }
    };
  }, [socket]);

  const onMessageChange = (e: React.ChangeEvent) => {
    // @ts-ignore
    const { value } = e.target;
    if (value.length <= 100) {
      setMessage(value);
    }
  };

  const onMessageSubmit = () => {
    if (message.length) {
      socket.emit('messageLobby', {
        token: isLoggedIn(),
        message,
        lobbyId,
      });
      setMessage('');
    }
  };

  const onMessageKeypress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onMessageSubmit();
    }
  };

  const renderLobbyChat = () => {
    return (
      <section style={wrapperStyles}>
        <Header>Chat</Header>
        <div style={messagesStyles}>
          <div style={scrollStyles}>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.username}:</strong>&nbsp;
                {msg.message}
              </div>
            ))}
          </div>
        </div>

        <Input
          actionPosition={'right' as any}
          placeholder="Send a message"
          action
          value={message}
          onChange={onMessageChange}
          onKeyPress={onMessageKeypress}
        >
          <input></input>
          <Button
            color="teal"
            onClick={() => {
              onMessageSubmit();
            }}
          >
            <i
              className="fas fa-level-down-alt"
              style={{ transform: 'rotate(90deg)' }}
            ></i>
          </Button>
        </Input>
      </section>
    );
  };

  return renderLobbyChat();
};

export default LobbyChat;
