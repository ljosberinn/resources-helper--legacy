import * as React from "react";
import * as ReactDOM from "react-dom";
//import registerServiceWorker from './registerServiceWorker';
import ApiKey from "./components/ApiKey";

ReactDOM.render(
  <ApiKey apiKey={""}/>,
  document.getElementById("root") as HTMLElement
);

//registerServiceWorker();
