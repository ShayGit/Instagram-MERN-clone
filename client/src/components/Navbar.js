import { Link, NavLink } from "react-router-dom";
import React, { useContext, useEffect, useRef, useState } from "react";

import { Context as AuthContext } from "../context/AuthContext";
import M from "materialize-css";

const NavBar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [usersDetails, setUsersDetails] = useState([]);
  const {
    state: { user,token },
    signout,
  } = useContext(AuthContext);

  useEffect(() => {
    M.Modal.init(searchModal.current);
  },[]);

  const fetchUsers = async(query)=>{
    setSearch(query);
    const res = await fetch('/searchUsers',{
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({query})
    });
    const data = await res.json();
    setUsersDetails(data.users);
  }
  
  return (
    <nav>
      <div className="nav-wrapper white">
        <NavLink to={user ? "/" : "/signin"} className="brand-logo left">
          Instagram
        </NavLink>
        <ul id="nav-mobile" className="right">
          {user ? (
            <>
              <li>
                <i
                  data-target="modal1"
                  className="modal-trigger large material-icons"
                  style={{ color: "black" }}
                >
                  search
                </i>
              </li>
              <li>
                <NavLink to="/profile">My Profile</NavLink>
              </li>
              <li>
                <NavLink to="/myFollowingsPosts">My following posts</NavLink>
              </li>
              <li>
                <NavLink to="/create">Create Post</NavLink>
              </li>
              <li>
                <button
                  className="btn waves-effect waves-light #c62828 red darken-3"
                  onClick={() => signout()}
                >
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
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
      >
        <div className="modal-content" style={{ color: "black" }}>
          <input
            type="text"
            placeholder="search user"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul className="collection" style={{display: 'flex', flexDirection:'column'}}>
            {usersDetails.map(item => {
              return <li key={item._id} className="collection-item"
            onClick={() => {
              M.Modal.init(searchModal.current).close();
              setSearch('');
              window.location.href= (item._id !== user._id) ? "/profile/"+item._id : "/profile";
              }}>{item.email}</li> 
            })}
           
          </ul>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" onClick={()=> setSearch("")}>
            Close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
