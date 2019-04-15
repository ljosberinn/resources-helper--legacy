import React, { useState, ChangeEvent, FormEvent } from 'react';
import { regExp, htmlPattern } from './Shared';
import { DEV_SETTINGS } from '../../developmentSettings';
import { DebounceInput } from 'react-debounce-input';

const authenticationURL = `${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}/auth/register`;

interface IRegistrationPayload {
  mail: string;
  password: string;
  apiKey?: string;
}

interface RegistrationError {
  error: string;
}

const Registration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [hasError, setError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const [isValidPasswordRepetition, setPasswordRepetitionValidation] = useState(false);

  const handleMailChange = (e: ChangeEvent<HTMLInputElement>) => setMail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const upcomingPassword = e.target.value;
    setPassword(upcomingPassword);
    setPasswordRepetitionValidation(repeatedPassword === upcomingPassword);
  };

  const handlePasswordRepetitionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const repetitionPassword = e.target.value;
    setRepeatedPassword(repetitionPassword);
    setPasswordRepetitionValidation(repetitionPassword === password);
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

  const disabled = !(
    mail.length > 0 &&
    password.length > 0 &&
    regExp.test(password) &&
    regExp.test(repeatedPassword) &&
    !isSubmitting &&
    !hasError &&
    isValidPasswordRepetition
  );

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="mail" required onChange={handleMailChange} disabled={isSubmitting} />
      <DebounceInput
        type="password"
        placeholder="password"
        pattern={htmlPattern}
        required
        onChange={handlePasswordChange}
        disabled={isSubmitting}
        debounceTimeout={300}
        minLength={3}
      />
      <DebounceInput
        type="password"
        placeholder="repeat password"
        pattern={htmlPattern}
        required
        onChange={handlePasswordRepetitionChange}
        disabled={isSubmitting}
        debounceTimeout={300}
        minLength={3}
      />
      <button type="submit" disabled={disabled}>
        Register
      </button>

      {hasError ? <p>{errorText}</p> : null}

      {password.length > 0 && repeatedPassword.length > 0 && !isValidPasswordRepetition ? <p>Passwords not matching</p> : null}
    </form>
  );
};

Registration.displayName = 'Registration';
//@ts-ignore
Registration.whyDidYouRender = true;

export default Registration;
