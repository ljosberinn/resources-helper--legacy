import * as React from "react";
import { Route, Switch } from "react-router-dom";
import API from "./API/API";
//import SpecialBuildings from "./Buildings/SpecialBuildings";
import Factories from "./Factories/Factories";
import Navigation from "./Navigation";

const devComponent = () => <div>coming soon</div>;

const routes = {
  login: devComponent,
  signup: devComponent,
  api: API,
  settings: devComponent,
  mines: devComponent,
  factories: Factories,
  gd: devComponent,
  wh: devComponent,
  flow: devComponent,
  //buildings: SpecialBuildings,
  recycling: devComponent,
  units: devComponent,
  tu: devComponent,
  hq: devComponent,
  missions: devComponent,
  trade: devComponent,
  attack: devComponent,
  defense: devComponent,
  maps: devComponent,
  prices: devComponent,
  quality: devComponent,
  leaderboard: devComponent,
  changelog: devComponent,
  discord: devComponent
};

const Routes: React.FunctionComponent = () => (
  <React.Fragment>
    <Navigation />
    <Switch>
      <Route exact path="/" component={devComponent} />
      {Object.entries(routes).map((entry, key) => {
        const [path, component] = entry;

        return <Route key={key} path={`/${path}`} component={component} />;
      })}
      <Route component={() => <div>404</div>} />
    </Switch>
  </React.Fragment>
);

export default Routes;
