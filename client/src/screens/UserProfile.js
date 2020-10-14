import React, { useContext, useEffect, useState } from "react";

import { Context as AuthContext } from "../context/AuthContext";
import ProfileHeader from '../components/ProfileHeader'
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const {
    state: { token, user },
    updateUserFollow
  } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);

  const { userId } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/user/${userId}`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      return { user: data.user, posts: data.posts };
    };
    fetchPosts().then((userProfile) => {
      setUserProfile(userProfile);
    });
  }, []);

  const followUser = async()=> {
    const res = await fetch('/follow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        followId: userId
      }),
    });
    const data = await res.json();
    updateUserFollow({followers:data.userFollowing.followers, following: data.userFollowing.following});
    localStorage.setItem("user",JSON.stringify(data.userFollowing));
    setUserProfile((prevState)=>{
      return { ...prevState,
        user:{ ...data.userToFollow
        }

      }
    });
  }

  const unfollowUser = async()=> {
    const res = await fetch('/unfollow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        unfollowId: userId
      }),
    });
    const data = await res.json();
    updateUserFollow({followers:data.userUnfollowing.followers, following: data.userUnfollowing.following});
    localStorage.setItem("user",JSON.stringify(data.userUnfollowing));
    setUserProfile((prevState)=>{
      return { ...prevState,
        user:{ ...data.userToUnfollow
        }

      }
    });
    console.log(data);
  }

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "600px", margin: "0px auto" }}>
           <ProfileHeader isMyProfile={false} followUser={followUser} unfollowUser={unfollowUser} userInput={userProfile.user} postsNumber={userProfile.posts.length}/>
           
          <div className="gallery">
            {userProfile.posts.map((post) => {
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

export default UserProfile;
