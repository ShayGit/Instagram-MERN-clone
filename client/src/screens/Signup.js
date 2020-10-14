import { Link, useHistory } from "react-router-dom";
import React, { useState } from "react";

import M from "materialize-css";
import useStateCallback from "../custom_hooks/useStateCallback";

const Signin = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useStateCallback("");

  const history = useHistory();

  const UploadImg = async () => {
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "instagram-clone-mern");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/instagram-clone-mern/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  const Signup = async (imageUrl) => {
    try {

    let body;
    imageUrl
      ? (body = JSON.stringify({
          name,
          username,
          password,
          email,
          image: imageUrl,
        }))
      : (body = JSON.stringify({
          name,
          username,
          password,
          email,
        }));
    
      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      ) {
        M.toast({ html: "invalid Email", classes: "xc62828 red darken-3" });
        return;
      }
      const result = await fetch("signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body
      });
      const data = await result.json();
      if (data.error) {
        M.toast({ html: data.error, classes: "xc62828 red darken-3" });
      } else {
        M.toast({ html: data.message, classes: "x43a047 green darken-1" });
        history.push("/signin");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const PostData = async () => {
    try {
      if (image) {
        const res = await UploadImg();
        const resData = await res.json();
        setUrl(resData.url, async (urlState) => {
          Signup(urlState);
        });
      } else {
        Signup("");
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
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <div className="file-field input-field">
          <div className="btn #64b5f6 blue darken-1">
            <span>Upload profile image</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => PostData()}
        >
          Signup
        </button>
        <h5>
          <Link to="/signin">Already have an account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signin;
