import React from "react";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import CheckEmail from "../pages/CheckEmail";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { PATHS } from "./paths";
import firebase from "firebase/app";
import NotFound from "../pages/NotFound";
import Profile from "../pages/user-pages/Profile";
import Recommendations from "../pages/user-pages/Recommendations";

const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Switch>
        <Route exact path="/">
          <Redirect to={PATHS.HOME} />
        </Route>
        <Route exact path={PATHS.NOT_FOUND} component={NotFound} />
        <Route exact path={PATHS.HOME} component={Home} />
        <Route exact path={PATHS.LOGIN} component={Login} />
        <Route exact path={PATHS.SIGNUP} component={Signup} />
        <Route exact path={PATHS.CHECK_EMAIL} component={CheckEmail} />
        <Route exact path={PATHS.PROFILE} component={Profile} />
        <Route exact path={PATHS.RECOMMENDATIONS} component={Recommendations} />
        <Redirect to={PATHS.NOT_FOUND} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
