import React, { useContext, useEffect, useState } from "react";

import { Context as AuthContext } from "../context/AuthContext";
import ProfileHeader from '../components/ProfileHeader'
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
        <>
        <div style={{ maxWidth: "600px", margin: "0px auto" }}>
          <ProfileHeader isMyProfile={true} updatePhoto={updatePhoto} setLoading={setLoading} userInput={user} postsNumber={myPosts.length}/>
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
        </>
      ) : (
        <h2 className="loading"> loading... </h2>
      )}
    </>
  );
};

export default Profile;
