import * as React from 'react';
import { RegisterState, RegisterProps } from './types';
import { isEqual } from 'lodash';
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
  }

  componentDidUpdate(_prevProps: RegisterProps, prevState: RegisterState) {
    if (!isEqual(prevState.username, this.state.username)) {
      const { username } = this.state;
      request({
        method: 'get',
        url: `register/username${queryParams({
          username
        })}`
      }).then(console.log);
    }
  }

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

  render() {
    const { username, email, password, confirmPassword } = this.state;
    return (
      <div>
        <h1>Register to play GToons</h1>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={this.onInputChange}
        />

        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={this.onInputChange}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={this.onInputChange}
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={confirmPassword}
          onChange={this.onInputChange}
        />
      </div>
    );
  }
}
