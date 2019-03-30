import React, { useState, memo, ChangeEvent, FormEvent } from 'react';
import { regExp, htmlPattern } from './Shared';
import { DEV_SETTINGS } from '../../developmentSettings';

const authenticationURL = `${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/auth/register`;

interface IRegistrationPayload {
  mail: string;
  password: string;
  apiKey?: string;
}

interface RegistrationError {
  error: string;
}

export const Registration = memo(() => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const handleMailChange = (e: ChangeEvent<HTMLInputElement>) => setMail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    if (regExp.test(password)) {
      setPassword(password);
    }
  };

  const validateRegistration = async (payload: IRegistrationPayload) => {
    setIsSubmitting(true);

    const body = new FormData();

    Object.entries(payload).forEach(([key, value]) => body.append(key, value));

    const response = await fetch(authenticationURL, {
      credentials: 'same-origin',
      method: 'POST',
      body,
    });

    setIsSubmitting(false);

    if (response.ok) {
      if (hasError) {
        setError(false);
        setErrorText('');
      }

      location.href = '/login';
      return;
    }

    // manipulated html will result in 401 which doesnt contain error description
    if (response.status !== 401) {
      const json = (await response.json()) as RegistrationError;

      setError(true);
      setErrorText(json.error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await validateRegistration({ mail, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type={'email'}
        placeholder={'mail'}
        required
        name={'mail'}
        onChange={handleMailChange}
        disabled={isSubmitting}
        defaultValue={mail}
      />
      <input
        type={'password'}
        pattern={htmlPattern}
        required
        name={'password'}
        onChange={handlePasswordChange}
        disabled={isSubmitting}
        defaultValue={password}
      />
      <button type="submit" disabled={isSubmitting}>
        Register
      </button>
      {hasError ? <p>{errorText}</p> : void 0}
    </form>
  );
});
