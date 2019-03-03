import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import API from "./views/API/API";
import "./blueprint.css";

export interface Props {

}

class App extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home}/>
          <Route path="/api" component={API}/>
        </div>
      </Router>
    );
  }
}

const Home = () => <h2>Home</h2>;

export default App;
