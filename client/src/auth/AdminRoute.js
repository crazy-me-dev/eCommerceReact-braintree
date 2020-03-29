import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const AdminRoute = ({ component: Component, ...rest }) => {
  const { user } = useSelector(state => ({
    ...state.authReducer
  }));

  return (
    <Route
      {...rest}
      render={props => {
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
};

export default AdminRoute;
