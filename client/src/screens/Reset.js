import { Link, useHistory } from "react-router-dom";
import React, { useContext, useState } from "react";

import { Context as AuthContext } from "../context/AuthContext";
import M from "materialize-css";

const Reset = () => {
  const [email, setEmail] = useState("");
  const history = useHistory();

  const sendReset = async () => {
    try {
        if (
          !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
          )
        ) {
          M.toast({ html: "invalid Email", classes: "xc62828 red darken-3" });
          return;
        }
        const result = await fetch("/resetPassword", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
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
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => sendReset()}
        >
          Reset password
        </button>
      </div>
    </div>
  );
}

export default Reset;
