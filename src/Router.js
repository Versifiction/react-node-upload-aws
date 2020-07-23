import React from "react";
import { Route, Switch } from "react-router-dom";

import Accueil from "./Accueil";
import Page from "./Page";

function Router() {
  return (
    <Switch>
      <Route path="/" exact component={Accueil} />
      <Route path="/:username" exact component={Page} />
    </Switch>
  );
}

export default Router;
