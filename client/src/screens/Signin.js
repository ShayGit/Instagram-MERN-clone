import { Link, useHistory } from "react-router-dom";
import React, { useContext, useState } from "react";

import { Context as AuthContext } from "../context/AuthContext";

const Signin = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();
  const { signin } = useContext(AuthContext);

  return (
    <div className="mycard">
      <div className="card auth-card center input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => signin({email,password})}
        >
          Sign in
        </button>
        <h5>
          <Link to="/signup">Dont have an account?</Link>
        </h5>
        <h6>
          <Link to="/reset">Forgot password?</Link>
        </h6>
      </div>
    </div>
  );
};

export default Signin;
