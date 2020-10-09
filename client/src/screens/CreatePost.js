import React, { useState } from "react";

import M from 'materialize-css';
import { useHistory } from "react-router";
import useStateCallback from "../custom_hooks/useStateCallback"

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useStateCallback("");
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const postDetails = async () => {
    try{
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "instagram-clone-mern");
      const res = await fetch("https://api.cloudinary.com/v1_1/instagram-clone-mern/image/upload", {
        method: "post",
        body: data,
      });
      const resData = await res.json();
      setUrl(resData.url,async(urlState)=> {

        const result = await fetch("/createpost", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+ localStorage.getItem("jwt")
          },
          body: JSON.stringify({
            title,
            body,
            image: urlState
          }),
        });
        const responseData= await result.json();
        if(responseData.error)
        {
          M.toast({html:responseData.error,classes:"xc62828 red darken-3"});
        }
        else{
          M.toast({html:"Post created successfully",classes:"x43a047 green darken-1"});
          history.push('/')
        }
      } );
      setLoading(false);
    }
    catch (err) {
      setLoading(false);
      console.log(err);
    }
  };


 
  return (
    loading ? (
        <h2 className="loading"> loading... </h2>
     ) :
    <div
      className="card input-field"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>Upload image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
      onClick={()=>{
        setLoading(true);
        postDetails();
      }}>
        Upload Post
      </button>
    </div>
    );
};

export default CreatePost;
