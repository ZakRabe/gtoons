import { Button, Header, Input } from 'semantic-ui-react';
import * as React from 'react';
import { request } from '../../utils/api';
import { LoginProps, LoginState } from './types';

export default class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  componentDidMount() {
    const { history } = this.props;
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      request({
        url: 'login/validateToken',
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
      target: { name, value },
    } = e as any;

    this.setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  submit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    const { username, password } = this.state;
    const { history } = this.props;
    this.setState({ error: '' });

    request({
      method: 'post',
      url: 'login/submit',
      data: { username, password },
    })
      .then((token) => {
        localStorage.setItem('authToken', token);
        history.push('/profile');
      })
      .catch((error) => {
        this.setState({ error: error.data.message });
      });
  };

  render() {
    const { username, password, error } = this.state;

    return (
      <>
        <Header as="h1">Login to Play GToons!</Header>
        <form action="" onSubmit={this.submit}>
          <div>
            <Input
              name="username"
              label="Username"
              value={username}
              onChange={this.onInputChange}
            />
          </div>
          <div>
            <Input
              name="password"
              type="password"
              label="Password"
              value={password}
              onChange={this.onInputChange}
            />
          </div>
          <p>{error}</p>
          <Button variant="contained" onClick={this.submit}>
            Submit
          </Button>
        </form>
      </>
    );
  }
}
