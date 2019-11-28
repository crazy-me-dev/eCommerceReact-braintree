import React from "react";
import { Route, Redirect } from "react-router-dom";

import { isAuthenticated } from "./index.js";

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const { user } = isAuthenticated();
      if (user && user.role === 1) {
        return <Component {...props} />;
      } else {
        return (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location }
            }}
          />
        );
      }
    }}
  />
);

export default AdminRoute;
