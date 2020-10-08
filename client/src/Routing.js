import React, { useContext, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import {Context as AuthContext} from "./context/AuthContext"
import CreatePost from "./screens/CreatePost";
import FollowedUsersPosts from "./screens/FollowedUsersPosts";
import Home from "./screens/Home";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./screens/Profile";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import UserProfile from "./screens/UserProfile";

const Routing = () => {
    const { state:{isLoading},setUserAndToken } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
      console.log("routing useeffect")
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("jwt");
      if(user&& token)
      {
        setUserAndToken({ user, token });
      }
      else{
        setUserAndToken({ user:null, token:"" });
        history.push('/signin')
      }
    }, []);
  
    return (
        (!isLoading &&
      <Switch>
          <PrivateRoute exact path="/">
          <Home />
        </PrivateRoute>
        <PrivateRoute exact path="/profile">
          <Profile />
        </PrivateRoute>
        <PrivateRoute path="/create">
          <CreatePost />
        </PrivateRoute>
        <PrivateRoute path="/profile/:userId">
          <UserProfile />
        </PrivateRoute>
        <PrivateRoute path="/myFollowingsPosts">
          <FollowedUsersPosts />
        </PrivateRoute>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
      </Switch>
        )
    );
  };

  export default Routing;