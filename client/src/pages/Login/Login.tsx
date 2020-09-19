import { Button, TextInput, InlineNotification } from 'carbon-components-react';
import * as React from 'react';
import { request } from '../../utils/api';
import { isLoggedIn } from '../../utils/auth';
import './styles.css';
import { LoginProps, LoginState } from './types';
import { withGoogleReCaptcha } from 'react-google-recaptcha-v3';

class Login extends React.Component<LoginProps, LoginState> {
  recaptchaToken = null;

  constructor(props: LoginProps) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  async componentDidMount() {
    const { history, googleReCaptchaProps } = this.props;

    this.recaptchaToken = await googleReCaptchaProps.executeRecaptcha('login');

    const authToken = isLoggedIn();
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
    const { history, googleReCaptchaProps } = this.props;
    this.setState({ error: '' });

    request({
      method: 'post',
      url: 'login/submit',
      data: { username, password, recaptchaToken: this.recaptchaToken },
    })
      .then(({ token, user }) => {
        localStorage.setItem('authToken', token);
        history.push('/profile');
      })
      .catch(async (error) => {
        // refresh the token
        this.recaptchaToken = await googleReCaptchaProps.executeRecaptcha(
          'login'
        );
        this.setState({ error: error.data.message });
      });
  };

  render() {
    const { username, password, error } = this.state;

    return (
      <>
        <div className="loginWrapper">
          <h1>Login to start playing!</h1>
          <form onSubmit={this.submit}>
            <p>
              <TextInput
                id="username"
                name="username"
                labelText="Username"
                value={username}
                onChange={this.onInputChange}
              />
            </p>
            <p>
              <TextInput
                id="password"
                name="password"
                type="password"
                labelText="Password"
                value={password}
                onChange={this.onInputChange}
              />
            </p>
            <p>
              <a href="/passwordReset">Forgot your password?</a>
            </p>
            <p>
              {error && (
                <InlineNotification
                  title="Error"
                  subtitle={error}
                  kind="error"
                ></InlineNotification>
              )}
            </p>
            <div className="loginAction login--btn-set">
              <Button
                className="registerButton"
                kind="secondary"
                href="/register"
              >
                Sign up
              </Button>
              <Button
                className="loginSubmit"
                type="submit"
                onClick={this.submit}
              >
                Log in
              </Button>
            </div>
          </form>
        </div>
      </>
    );
  }
}

export default withGoogleReCaptcha(Login);
