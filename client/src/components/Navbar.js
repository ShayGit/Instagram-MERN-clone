import React, { useContext } from "react";

import { Context as AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const {
    state: { user },
    signout
  } = useContext(AuthContext);

  return (
    <nav>
      <div className="nav-wrapper white">
        <NavLink to={user?"/":"/signin"} className="brand-logo left">
          Instagram
        </NavLink>
        <ul id="nav-mobile" className="right">
          {user ? (
            <>
                 <li>
                <NavLink to="/profile">My Profile</NavLink>
              </li>
              <li>
                <NavLink to="/myFollowingsPosts">My following posts</NavLink>
              </li>
              <li>
                <NavLink to="/create">Create Post</NavLink>
              </li>
              <li >
                  <button className="btn waves-effect waves-light #c62828 red darken-3" 
                  onClick={()=> signout()}>
                    Signout
                  </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/signin">Signin</NavLink>
              </li>
              <li>
                <NavLink to="/signup">Signup</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
