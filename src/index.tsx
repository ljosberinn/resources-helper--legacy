import * as React from "react";
import * as ReactDOM from "react-dom";
//import registerServiceWorker from './registerServiceWorker';
import ApiKey from "./components/ApiKey";

ReactDOM.render(
  <ApiKey apiKey={"bb4d6e66508b4dd58b61ff118acbffe958cba26f85be3"}/>,
  document.getElementById("root") as HTMLElement
);

//registerServiceWorker();
