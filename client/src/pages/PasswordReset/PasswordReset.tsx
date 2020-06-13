import { TextInput, Button } from 'carbon-components-react';
import React, { useState, useEffect } from 'react';
import './styles.css';
import { PasswordResetProps } from './types';
import { request, queryParams } from '../../utils/api';
import { validatePassword } from '../../utils/validation';

const PasswordReset: React.FunctionComponent<PasswordResetProps> = (props) => {
  const {
    match: {
      params: { token },
    },
  } = props;

  const [working, setWorking] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setWorking(true);
    request({ url: `users/passwordResetToken${queryParams({ token })}` })
      .then(setValidToken)
      .finally(() => setWorking(false));
  }, [token]);

  useEffect(() => {
    setPasswordErrors(validatePassword(password));
  }, [password]);

  const onEmailChange = (e: React.ChangeEvent) => {
    // @ts-ignore
    setEmail(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWorking(true);

    request({ url: 'users/passwordReset', method: 'post', data: { email } })
      .then(setResetSent)
      .finally(() => {
        setWorking(false);
      });
  };

  const requestForm = () => {
    if (resetSent) {
      return (
        <div>
          <p>
            We've sent you an email with instructions on how to proceed. Don't
            forget to check your spam folder!
          </p>
        </div>
      );
    }
    return (
      <div>
        <p>
          Enter your email address here, and if an account exists for it, you
          will receive an email with instructions on how to reset
        </p>
        <form onSubmit={onSubmit}>
          <p>
            <TextInput
              id="email"
              labelText="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={onEmailChange}
            />
          </p>
          <p style={{ textAlign: 'right' }}>
            <Button
              type="submit"
              color="primary"
              disabled={!email.length || working}
            >
              Request password reset
            </Button>
          </p>
        </form>
      </div>
    );
  };

  const renderPasswordErrors = () => {
    return (
      <ul>
        {passwordErrors.map((error) => {
          return <li key={error}>{error}</li>;
        })}
      </ul>
    );
  };

  const renderConfirmPasswordErrors = () => {
    if (password === confirmPassword) {
      return null;
    }
    return (
      <ul>
        <li>Passwords don't match</li>
      </ul>
    );
  };

  const onPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWorking(true);
    request({
      url: 'users/passwordChange',
      method: 'post',
      data: { token, password },
    })
      .then(setSuccess)
      .finally(() => setWorking(false));
  };

  const resetForm = () => {
    if (success) {
      return (
        <div>
          <p>Successfully reset your password!</p>
        </div>
      );
    }
    if (!validToken) {
      return (
        <div>
          <p>
            Sorry, we were unable to find a password reset request for this
            token
          </p>
        </div>
      );
    }
    return (
      <div>
        <p>Enter and confirm your new password.</p>
        <form onSubmit={onPasswordSubmit}>
          <p>
            <TextInput
              labelText="New Password"
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {renderPasswordErrors()}
          </p>

          <p>
            <TextInput
              labelText="Confirm Password"
              id="confirm-password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {renderConfirmPasswordErrors()}
          </p>
          <div style={{ textAlign: 'right' }}>
            <Button
              disabled={
                working ||
                !!passwordErrors.length ||
                confirmPassword !== password
              }
              type="submit"
            >
              Change password
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const renderPasswordReset = () => {
    return (
      <div className="wrapper">
        <h1>Forgot your password?</h1>

        {token ? resetForm() : requestForm()}
      </div>
    );
  };

  return renderPasswordReset();
};

export default PasswordReset;
