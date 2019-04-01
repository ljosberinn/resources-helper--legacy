import React, { FormEvent, useState, ChangeEvent, memo } from 'react';
import { DEV_SETTINGS } from '../../developmentSettings';
import { login, LoginResponse } from '../../actions/Authentication';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { regExp, htmlPattern } from './Shared';

const authenticationURL = `${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/auth/login`;

interface PropsFromState {}
interface PropsFromDispatch {
  login: typeof login;
}

type LoginType = PropsFromState & PropsFromDispatch;

const ConnectedLogin = memo((props: LoginType) => {
  const [mail, setMail] = useState('admin@gerritalex.de');
  const [password, setPassword] = useState('resourcesHelper1992');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const validateLogin = async () => {
    setIsSubmitting(true);

    const body = new FormData();

    Object.entries({ mail, password }).forEach(([key, value]) => body.append(key, value));

    const response = await fetch(authenticationURL, {
      credentials: 'same-origin',
      method: 'POST',
      body,
    });

    setIsSubmitting(false);

    if (response.ok) {
      if (error) {
        setError(false);
      }

      const json = (await response.json()) as LoginResponse;
      console.table(json);
      //props.login(json);

      //location.href = '/dashboard';

      return;
    }

    setError(true);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleMailChange = (e: ChangeEvent<HTMLInputElement>) => setMail(e.target.value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await validateLogin();
  };

  const disabled = !(regExp.test(password) && mail.length > 2 && !isSubmitting);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="mail"
        required
        onChange={handleMailChange}
        disabled={isSubmitting}
        defaultValue={mail}
      />
      <input
        type="password"
        pattern={htmlPattern}
        required
        onChange={handlePasswordChange}
        disabled={isSubmitting}
        defaultValue={password}
      />
      <button type="submit" disabled={disabled}>
        Login
      </button>
      {error ? <p>Invalid data provided.</p> : null}
    </form>
  );
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  login: (response: LoginResponse) => dispatch(login(response)),
});

const preconnect = connect(
  null,
  mapDispatchToProps,
);

export const Login = preconnect(ConnectedLogin);
