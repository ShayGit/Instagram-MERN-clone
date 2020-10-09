import { Link, useHistory, useParams } from "react-router-dom";
import React, { useContext, useState } from "react";

import { Context as AuthContext } from "../context/AuthContext";
import M from "materialize-css";

const NewPassword = () => {
  const [password, setPassword] = useState("");
const   {token} = useParams();
const history = useHistory();

  const updatePassword = async () => {
    try {
        const result = await fetch("/updatePassword", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password
          }),
        });
        const data = await result.json();
        if (data.error) {
          M.toast({ html: data.error, classes: "xc62828 red darken-3" });
        } else {
          history.push('/signin');
          M.toast({
            html: data.message,
            classes: "x43a047 green darken-1",
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

  return (
    <div className="mycard">
      <div className="card auth-card center input-field">
        <h2>Instagram</h2>
        <input
          type="password"
          placeholder="enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => updatePassword()}
        >
          Update password
        </button>
      </div>
    </div>
  );
};

export default NewPassword;
