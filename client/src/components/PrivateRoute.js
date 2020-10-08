import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";

import { Context as AuthContext } from "../context/AuthContext";

function PrivateRoute({ children, ...rest }) {

  const {
    state: { user },
  } = useContext(AuthContext);
  
    return (
      <Route
        {...rest}
        render={({ location }) =>
        user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

export default PrivateRoute;