import * as React from 'react';
import { Header } from 'semantic-ui-react';
import {
  socketConnect,
  // @ts-ignore: no types for this
} from 'socket.io-react';
import ImageUpload from '../../components/ImageUpload';
import { logOut } from '../../utils/auth';

class Profile extends React.Component<{ socket: any }, {}> {
  render() {
    return (
      <>
        <Header as="h1">Profile</Header>
        <ImageUpload endpoint={''} />
        <button onClick={logOut}>Log Out</button>
      </>
    );
  }
}

export default socketConnect(Profile);
