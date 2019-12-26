import { Button, TextField } from '@material-ui/core';
import * as React from 'react';
import { request } from '../../utils/api';
import { LoginProps, LoginState } from './types';

export default class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }

  componentDidMount() {
    const { history } = this.props;
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      request({
        url: 'login/validateToken'
      })
        .then(() => {
          // this means the token was still valid, so there's no need to be on this page
          history.push('/profile');
        })
        .catch(() => {
          // this means the token was invalid, so we dont need to do anything.
          // the token was already cleared in the request helper upon recieveing a 401
        });
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

  submit = () => {
    const { username, password } = this.state;
    const { history } = this.props;
    request({
      method: 'post',
      url: 'login/submit',
      data: { username, password }
    })
      .then(token => {
        localStorage.setItem('authToken', token);
        history.push('/profile');
      })
      .catch(console.log);
  };

  render() {
    const { username, password } = this.state;

    return (
      <div>
        <h2>Login to Play GToons!</h2>
        <div>
          <TextField
            name="username"
            label="Username"
            value={username}
            onChange={this.onInputChange}
          />
        </div>
        <div>
          <TextField
            name="password"
            type="password"
            label="Password"
            value={password}
            onChange={this.onInputChange}
          />
        </div>
        <Button variant="contained" color="primary" onClick={this.submit}>
          Submit
        </Button>
      </div>
    );
  }
}
