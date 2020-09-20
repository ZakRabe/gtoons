import { Button, InlineNotification, TextInput } from 'carbon-components-react';
import { debounce, isEqual } from 'lodash';
import * as React from 'react';
import { withGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { queryParams, request } from '../../utils/api';
import { isValidEmail, validatePassword } from '../../utils/validation';
import './styles.css';
import { RegisterProps, RegisterState } from './types';

export class Register extends React.Component<RegisterProps, RegisterState> {
  recaptchaToken = null;

  constructor(props: RegisterProps) {
    super(props);
    this.state = {
      usernameAvailable: null,
      emailAvailable: null,
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      passwordErrors: [],
      complete: false,
      failed: false,
    };

    // wait a second after the user has stopped typing to fire the API calls
    this.getUsernameIsValid = debounce(this.getUsernameIsValid, 1000);
    this.getEmailIsValid = debounce(this.getEmailIsValid, 1000);
  }

  async componentDidMount() {
    const { googleReCaptchaProps } = this.props;

    this.recaptchaToken = await googleReCaptchaProps.executeRecaptcha(
      'register'
    );
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
        username,
      })}`,
    }).then((usernameAvailable) => this.setState({ usernameAvailable }));
  };

  getEmailIsValid = () => {
    const { email } = this.state;
    if (!isValidEmail(email)) {
      return;
    }
    request({
      method: 'get',
      url: `register/validEmail${queryParams({
        email,
      })}`,
    }).then((emailAvailable) => this.setState({ emailAvailable }));
  };

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
    return 'An account already exists for this address.';
  };

  validatePassword = (password: string) => {
    const passwordErrors = validatePassword(password);

    this.setState({
      passwordErrors,
    });
  };

  renderPasswordErrors = () => {
    const { passwordErrors } = this.state;

    return (
      <ul>
        {passwordErrors.map((error) => {
          return <li key={error}>{error}</li>;
        })}
      </ul>
    );
  };

  renderConfirmPasswordErrors = () => {
    const { password, confirmPassword } = this.state;

    if (password === confirmPassword) {
      return null;
    }
    return (
      <ul>
        <li>Passwords don't match</li>
      </ul>
    );
  };

  submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (this.hasErrors()) {
      return;
    }

    const { username, email, password, confirmPassword } = this.state;

    request({
      method: 'post',
      url: 'register/submit',
      data: {
        username,
        email,
        password,
        confirmPassword,
        recaptchaToken: this.recaptchaToken,
      },
    })
      .then((response) => {
        this.setState({ complete: true });
      })
      .catch(async (error) => {
        const { googleReCaptchaProps } = this.props;
        this.recaptchaToken = await googleReCaptchaProps.executeRecaptcha(
          'register'
        );
        this.setState({ failed: true });
      });
  };

  renderSuccess = () => {
    return (
      <div className="registerWrapper">
        <h1>Registration complete!</h1>
        <Button href="/login">Log in now</Button>
      </div>
    );
  };

  verifyCallback = console.log;

  renderForm = () => {
    const {
      username,
      email,
      password,
      confirmPassword,
      passwordErrors,
      failed,
    } = this.state;

    return (
      <div className="registerWrapper">
        <h1>Register to play reToons</h1>
        <form onSubmit={this.submit}>
          <section style={{ marginBottom: '1em' }}>
            <TextInput
              labelText="Username"
              name="username"
              id="username"
              value={username}
              onChange={this.onInputChange}
            />
            {this.renderUsernameAvailable()}
          </section>
          <section style={{ marginBottom: '1em' }}>
            <TextInput
              type="email"
              labelText="Email"
              name="email"
              id="email"
              value={email}
              onChange={this.onInputChange}
            />
            {this.renderEmailAvailable()}
          </section>
          <section style={{ marginBottom: '1em' }}>
            <TextInput
              labelText="Password"
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => {
                this.validatePassword(e.target.value);
                this.onInputChange(e);
              }}
            />
            {passwordErrors.length > 0 && this.renderPasswordErrors()}
          </section>
          <section style={{ marginBottom: '1em' }}>
            <TextInput
              labelText="Confirm Password"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={this.onInputChange}
            />
            {this.renderConfirmPasswordErrors()}
          </section>

          <section style={{ marginBottom: '1em' }}>
            {failed && (
              <InlineNotification
                title="Error"
                subtitle="Sorry we were unable to proccess your registration, please try again."
                kind="error"
              ></InlineNotification>
            )}
          </section>
          <div className="registerAction register--btn-set">
            <Button className="loginButton" kind="secondary" href="/login">
              Log in
            </Button>
            <Button
              className="registerSubmit"
              type="submit"
              disabled={this.hasErrors()}
              kind="primary"
              onClick={this.submit}
            >
              Register
            </Button>
          </div>
        </form>
      </div>
    );
  };

  hasErrors = () => {
    const {
      username,
      email,
      passwordErrors,
      password,
      confirmPassword,
      usernameAvailable,
      emailAvailable,
    } = this.state;

    return (
      passwordErrors.length > 0 ||
      confirmPassword !== password ||
      !usernameAvailable ||
      !emailAvailable ||
      username.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0
    );
  };

  render() {
    const { complete } = this.state;
    return <div>{!complete ? this.renderForm() : this.renderSuccess()}</div>;
  }
}

export default withGoogleReCaptcha(Register);
