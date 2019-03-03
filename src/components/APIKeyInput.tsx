import * as React from "react";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { DEV_SETTINGS } from "../developmentSettings";

const APIKeyInput: FunctionComponent<{ apiKey?: string }> = ({ apiKey = "" }) => {
  const [key, setKey] = useState(apiKey);

  return (
    <label>
      <input type={"text"} maxLength={45} placeholder={"API key"} defaultValue={apiKey}
             onChange={e => setKey(extractChangeEventValue(e))}/>
      <button type={"button"} onClick={() => dispatchQuery(key)}>Fetch</button>
    </label>
  );
};

const dispatchQuery = (key: string) => isValidKey(key) ? queryAPI(key) : void 0;
const extractChangeEventValue = (event: ChangeEvent): string => (event.currentTarget as HTMLInputElement).value;
const isValidKey = (apiKey: string): boolean => apiKey.length === 45 && /[a-zA-Z0-9]/.test(apiKey);

const queryAPI = async (apiKey: string, query = 0) => {
  const url = `${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}?query=${query}&key=${apiKey}`;

  const data = await fetch(url);
  const json = await data.json();
  console.log(json);
};


export default APIKeyInput;
