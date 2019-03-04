import * as React from "react";
import { ChangeEvent, FunctionComponent } from "react";
import { IChangeUserAPIKeyAction, setAPIKey } from "../actions";
import { store } from "../Store";

interface APIKeyInputProps {
  APIKey: string;
  setAPIKey: () => IChangeUserAPIKeyAction;
}

const APIKeyInput: FunctionComponent<APIKeyInputProps> = (props: APIKeyInputProps) => {

  const validateKey = (e: ChangeEvent) => {
    const key = extractChangeEventValue(e);

    if (isValidKey(key)) {
      store.dispatch(setAPIKey(key));
    }
  };

  store.subscribe(() => {
    localStorage.setItem("store", JSON.stringify(store.getState()));
  });

  return (
    <div>
      <label>
        <input type={"text"} maxLength={45} placeholder={"API key"} defaultValue={props.APIKey} dir={"auto"}
               onChange={(e) => validateKey(e)}
        />
      </label>
      <button>Button</button>
    </div>
  );
};

const extractChangeEventValue = (event: ChangeEvent): string => (event.currentTarget as HTMLInputElement).value;

const isValidKey = (key: string) => key.length === 45 && /[a-zA-Z0-9]/.test(key);

export default APIKeyInput;
