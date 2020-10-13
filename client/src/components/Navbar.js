import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { Link, NavLink, useLocation } from "react-router-dom";
import React, { useContext, useEffect, useRef, useState } from "react";
import { RiAddBoxFill, RiAddBoxLine, RiLogoutCircleRLine } from "react-icons/ri";

import { Context as AuthContext } from "../context/AuthContext";
import { BiSearch } from "react-icons/bi";
import M from "materialize-css";

const NavBar = () => {
  const location = useLocation();
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [usersDetails, setUsersDetails] = useState([]);
  const {
    state: { user, token },
    signout,
  } = useContext(AuthContext);

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const fetchUsers = async (query) => {
    setSearch(query);
    const res = await fetch("/searchUsers", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setUsersDetails(data.users);
  };

  return (
    <nav className="navbar-main">
      <ul className="nav-ul">
        {user ? (
          <>
            <li className="nav-li">
              <Link className="nav-li" to={user ? "/" : "/signin"}>
              {location.pathname==="/" ? <AiFillHome className="icon"/> : 
                <AiOutlineHome className="icon"/>
              }
              </Link>
            </li>
            <li className="nav-li">
              <Link className="nav-li"
                to={location.pathname}
                onClick={() => {
                  M.Modal.init(searchModal.current).open();
                }}
              >
                <BiSearch className="icon" />
              </Link>
            </li>
            
            {/* <li>
              <Link to="/myFollowingsPosts">My following posts</Link>
            </li> */}
            <li className="nav-li">
              <Link className="nav-li" to="/create">
              {location.pathname==="/create" ?   <RiAddBoxFill className="icon"/>:<RiAddBoxLine className="icon"/> 
              
              }
              </Link>
            </li>
            <li className="nav-li">
              <Link className="nav-li" to="/profile">
                <img
                  alt={"My profile"}
                  src={user.image}
                  className={location.pathname==="/profile"? "profile-navlink-selected":"profile-navlink"}
                />
              </Link>
            </li>
            <li className="nav-li">
              <Link  className="nav-li" to={location.pathname} onClick={() => signout()}>
                <RiLogoutCircleRLine className="icon" />
                
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-link">
              <Link className="navlink" to="/signin">
                Signin
              </Link>
            </li>
            <li className="navbar-link">
              <Link className="navlink" to="/signup">
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
      <div id="modal1" className="modal" ref={searchModal}>
        <div className="modal-content" style={{ color: "black" }}>
          <input
            type="text"
            placeholder="search user"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul
            className="collection"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {usersDetails.map((item) => {
              return (
                <li
                  key={item._id}
                  className="collection-item"
                  onClick={() => {
                    M.Modal.init(searchModal.current).close();
                    setSearch("");
                    window.location.href =
                      item._id !== user._id
                        ? "/profile/" + item._id
                        : "/profile";
                  }}
                >
                  {item.email}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            Close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
