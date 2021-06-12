import HomePage from "./pages/HomePage";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const Routes = () => {

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        {/* <Route path="/login" exact component={LoginPage} /> */}
        {/* <PrivateRoute path="/users" exact component={UsersPage} />
        <PrivateRoute path="/users/add" exact component={UserPage} /> */}
      </Switch>
    </Router>
  );

}

export default Routes;