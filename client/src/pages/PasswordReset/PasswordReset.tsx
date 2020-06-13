import { TextInput, Button } from 'carbon-components-react';
import React, { useState } from 'react';
import './styles.css';
import { PasswordResetProps } from './types';
import { request } from '../../utils/api';

const PasswordReset: React.FunctionComponent<PasswordResetProps> = (props) => {
  const [working, setWorking] = useState(false);
  const [email, setEmail] = useState<string>('');

  const onEmailChange = (e: React.ChangeEvent) => {
    // @ts-ignore
    setEmail(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWorking(true);
    console.log(email);

    request({ url: 'users/passwordReset', method: 'post', data: { email } })
      .then((response) => {
        console.log(response);
      })
      .finally(() => {
        setWorking(false);
      });
  };

  const renderPasswordReset = () => {
    return (
      <div className="wrapper">
        <h1>Forgot your password?</h1>
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

  return renderPasswordReset();
};

export default PasswordReset;
