import React, { useContext, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";

import {Context as AuthContext} from "./context/AuthContext"
import CreatePost from "./screens/CreatePost";
import FollowedUsersPosts from "./screens/FollowedUsersPosts";
import Home from "./screens/Home";
import NewPassword from "./screens/NewPassword";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./screens/Profile";
import Reset from "./screens/Reset";
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
        if(!history.location.pathname.startsWith('/reset'))
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
        <PrivateRoute exact path="/profile/image/:imageIndex">
        <Profile />
        </PrivateRoute>
        <PrivateRoute exact path="/profile/:userId/image/:imageIndex">
          <UserProfile />
        </PrivateRoute>
        <PrivateRoute path="/profile/:userId">
          <UserProfile />
        </PrivateRoute>
        <PrivateRoute path="/myFollowingsPosts">
          <FollowedUsersPosts />
        </PrivateRoute>
        <Route exact path="/reset">
          <Reset />
        </Route>
        <Route path="/reset/:token">
          <NewPassword />
        </Route>
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