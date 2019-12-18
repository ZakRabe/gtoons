import * as React from 'react';
import { RegisterState, RegisterProps } from './types';
import { isEqual, debounce } from 'lodash';
import { request, queryParams } from '../../utils/api';
import { TextField } from '@material-ui/core';
import { isValidEmail } from '../../utils/validation';

export default class Register extends React.Component<
  RegisterProps,
  RegisterState
> {
  constructor(props: RegisterProps) {
    super(props);
    this.state = {
      usernameAvailable: null,
      emailAvailable: null,
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    // wait a second after the user has stopped typing to fire the API calls
    this.getUsernameIsValid = debounce(this.getUsernameIsValid, 1000);
    this.getEmailIsValid = debounce(this.getEmailIsValid, 1000);
  }

  componentDidUpdate(_prevProps: RegisterProps, prevState: RegisterState) {
    const { username, email } = this.state;
    if (!isEqual(prevState.username, username)) {
      this.getUsernameIsValid();
    }
    if (!isEqual(prevState.email, email)) {
      this.getEmailIsValid();
    }
  }

  getUsernameIsValid = () => {
    const { username } = this.state;
    request({
      method: 'get',
      url: `register/validUsername${queryParams({
        username
      })}`
    }).then(usernameAvailable => this.setState({ usernameAvailable }));
  };

  getEmailIsValid = () => {
    const { email } = this.state;
    if (!isValidEmail(email)) {
      return;
    }
    request({
      method: 'get',
      url: `register/validEmail${queryParams({
        email
      })}`
    }).then(emailAvailable => this.setState({ emailAvailable }));
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

  renderEmailAvailable = () => {
    const { emailAvailable, email } = this.state;
    if (emailAvailable === null || !email || emailAvailable) {
      return null;
    }
    return 'An account exists for this email. ';
  };

  render() {
    const { username, email, password, confirmPassword } = this.state;
    return (
      <div>
        <h1>Register to play GToons</h1>
        <div>
          <TextField
            label="Username"
            name="username"
            id="username"
            value={username}
            helperText={this.renderUsernameAvailable()}
            onChange={this.onInputChange}
          />
        </div>
        <div>
          <TextField
            type="email"
            label="Email"
            name="email"
            id="email"
            value={email}
            helperText={this.renderEmailAvailable()}
            onChange={this.onInputChange}
          />
        </div>
        <div>
          <TextField
            label="Password"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={this.onInputChange}
          />
        </div>
        <div>
          <TextField
            label="Confirm Password"
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
