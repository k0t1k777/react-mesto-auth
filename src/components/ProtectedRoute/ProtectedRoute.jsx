import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, isLoggedIn, ...props }) => {
  return (
    <Route>
      {() =>
        isLoggedIn
          ? <Component {...props} />
          : <Redirect to="signin" />
      }
    </Route>
  )
};

export default ProtectedRoute;
