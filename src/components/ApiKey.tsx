import * as React from "react";
import { ChangeEvent } from "react";
import { DEV_SETTINGS } from "../developmentSettings";

export interface Props {
  apiKey: string;
}

interface State {
  apiKey: string;
}

class ApiKey extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { apiKey: props.apiKey || "" };
  }

  static isValidKey(apiKey: string): boolean {
    return apiKey.length === 45 && /[a-zA-Z0-9]/.test(apiKey);
  }

  static extractChangeEventValue(event: ChangeEvent) {
    const currentTarget = event.currentTarget as HTMLInputElement;
    return currentTarget.value;
  }

  onChange(event: ChangeEvent) {
    const apiKey = ApiKey.extractChangeEventValue(event);
    this.setKey(apiKey);
  }

  setKey(apiKey: string) {
    if (ApiKey.isValidKey(apiKey)) {
      this.setState({ apiKey });
    }
  }

  queryAPI = async () => {
    const { apiKey } = this.state;
    const query = 1;

    const url = `${DEV_SETTINGS.isLive ? DEV_SETTINGS.uri.live : DEV_SETTINGS.uri.development}?query=${query}&key=${apiKey}`;

    const data = await fetch(url);
    const json = await data.json();
    console.log(json);
  };

  componentDidMount = (): void => {
    if (ApiKey.isValidKey(this.props.apiKey)) {
      this.setKey(this.props.apiKey);
    }
  };

  render() {
    return (
      <label>
        <input type={"text"} maxLength={45} placeholder={"API key"} defaultValue={this.props.apiKey}
               onChange={e => this.onChange(e)}/>
        <button type={"button"} onClick={this.queryAPI}>Fetch</button>
      </label>
    );
  }
}

export default ApiKey;
