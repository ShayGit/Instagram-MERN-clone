import React, { useContext, useEffect, useState } from "react";

import { Context as AuthContext } from "../context/AuthContext";
import useStateCallback from "../custom_hooks/useStateCallback";

const Profile = () => {
  const {
    state: { token, user },
    updateUserPhoto
  } = useContext(AuthContext);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useStateCallback("");

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/myposts", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      return data.myposts;
    };
    fetchPosts().then((posts) => {
      setMyPosts(posts);
    });
  }, []);

  const updatePhoto = async(file)=>{
    try {
      if(file){
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "instagram-clone-mern");
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/instagram-clone-mern/image/upload",
          {
            method: "post",
            body: data,
          }
        );
        const resData = await res.json();
          setUrl(resData.url, async (urlState) => {
           const res = await fetch("/updateImage", {
             method: "put",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token 
            },
            body: JSON.stringify({image:urlState})
          });
          const data = await res.json();
          console.log(data);
          localStorage.setItem("user",JSON.stringify({...user,image:data.image}))
           updateUserPhoto(data.image);
          });
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      {user && !loading? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "18px 0px",
            borderBottom: "1px solid grey",
          }}>
         
          
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <div>
              <img
                src={user.image}
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
              />
            </div>
            <div>
              <h4>{user.name}</h4>
              <h6>{user.email}</h6>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "108%",
                }}
              >
                <div> {myPosts.length} posts</div>
                <div> {user.followers.length} followers</div>
                <div> {user.following.length} following</div>
              </div>
            </div>
          </div>
          
        <div className="file-field input-field"  style={{margin:"10px 20px 10px 65px"}}>
          <div className="btn #64b5f6 blue darken-1">
            <span>Update Photo</span>
            <input type="file" onChange={(e) => {
              setLoading(true);
              updatePhoto(e.target.files[0]);
              e.target.value = null;}} />
          </div>
          
        </div>
        </div>
          <div className="gallery">
            {myPosts.map((post) => {
              return (
                <img
                  key={post._id}
                  alt={post.title}
                  className="item"
                  src={post.image}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2 className="loading"> loading... </h2>
      )}
    </>
  );
};

export default Profile;
