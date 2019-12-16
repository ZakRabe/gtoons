import * as React from 'react';
import { RegisterState, RegisterProps } from './types';
import { isEqual, debounce } from 'lodash';
import { request, queryParams } from '../../utils/api';

export default class Register extends React.Component<
  RegisterProps,
  RegisterState
> {
  constructor(props: RegisterProps) {
    super(props);
    this.state = {
      usernameAvailable: null,
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    // wait a second after the user has stopped typing to fire the API call
    this.getUsernameIsValid = debounce(this.getUsernameIsValid, 1000);
  }

  componentDidUpdate(_prevProps: RegisterProps, prevState: RegisterState) {
    const { username } = this.state;
    if (!isEqual(prevState.username, username)) {
      this.getUsernameIsValid();
    }
  }

  getUsernameIsValid = () => {
    const { username } = this.state;
    request({
      method: 'get',
      url: `register/username${queryParams({
        username
      })}`
    }).then(usernameAvailable => this.setState({ usernameAvailable }));
  };

  onInputChange = (e: React.ChangeEvent) => {
    const {
      target: { name, value }
    } = e as any;

    this.setState(prevState => {
      return {
        ...prevState,
        [name]: value
      };
    });
  };

  renderUsernameAvailable = () => {
    const { usernameAvailable, username } = this.state;
    if (usernameAvailable === null || !username) {
      return null;
    }
    return usernameAvailable
      ? 'This username is available!'
      : 'This username is not available.';
  };

  render() {
    const { username, email, password, confirmPassword } = this.state;
    return (
      <div>
        <h1>Register to play GToons</h1>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={this.onInputChange}
          />
          {this.renderUsernameAvailable()}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={this.onInputChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={this.onInputChange}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={this.onInputChange}
          />
        </div>
      </div>
    );
  }
}
