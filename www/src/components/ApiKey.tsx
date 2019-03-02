import * as React from "react";
import { ChangeEvent } from "react";

export interface Props {
  apiKey?: string;
}

interface State {
  apiKey: string;
}

class ApiKey extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { apiKey: props.apiKey || "" };
  }

  updateKey(apiKey: string) {
    this.setState({ apiKey });
  }

  validateKey(event: ChangeEvent) {
    const currentTarget = event.currentTarget as HTMLInputElement;
    const { value } = currentTarget;

    if (value.length === 45 && /[a-zA-Z0-9]/.test(value)) {
      this.updateKey(value);
      this.getAPI();
    }
  }

  async getAPI() {
    const { apiKey } = this.props;
    const query = 1;

    const data = await fetch(`http://localhost/rhelper4/www/public/api/?query=${query}&key=${apiKey}`);
    const json = await data.json();
    console.log(json);
  }

  render() {
    return (
      <label>
        <input type={"text"} maxLength={45} placeholder={"API key"} defaultValue={this.props.apiKey}
               onChange={e => this.validateKey(e)}/>
        <button type={"button"} onClick={this.getAPI}>Fetch</button>
      </label>
    );
  }
}

export default ApiKey;
