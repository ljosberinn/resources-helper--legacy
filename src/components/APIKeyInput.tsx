import * as React                                                          from 'react';
import { ChangeEvent, FunctionComponent }                                  from 'react';
import { IChangeUserAPIKeyAction, IIsAPIUserAction, isAPIUser, setAPIKey } from '../actions/API';
import { store }                                                           from '../Store';

interface APIKeyInputProps {
  APIKey?: string;
  setAPIKey?: () => IChangeUserAPIKeyAction;
  isAPIUser?: () => IIsAPIUserAction
}

const validateKey = (e: ChangeEvent) => {
  const key = extractChangeEventValue(e);

  if (isValidKey(key)) {
    store.dispatch(setAPIKey(key));
  }
};

const APIKeyInput: FunctionComponent<APIKeyInputProps> = (props: APIKeyInputProps) => {

  return (
    <div>
      <label>
        <input type={'text'} maxLength={45} placeholder={'API key'} defaultValue={props.APIKey} dir={'auto'}
               onChange={(e) => validateKey(e)}
        />
      </label>
      <button onClick={() => store.dispatch(isAPIUser(true))}>Button</button>
    </div>
  );
};

const extractChangeEventValue = (event: ChangeEvent): string => (event.currentTarget as HTMLInputElement).value;

const isValidKey = (key: string) => key.length === 45 && /[a-zA-Z0-9]/.test(key);

export default APIKeyInput;
