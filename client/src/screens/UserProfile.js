import React, { useContext, useEffect, useState } from "react";

import { Context as AuthContext } from "../context/AuthContext";
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
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              padding: "10px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                src={userProfile.user.image}
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "108%",
                }}
              >
                <div> {userProfile.posts.length} posts</div>
                <div> {userProfile.user.followers.length} followers</div>
                <div> {userProfile.user.following.length} following</div>
              </div>
              {userProfile.user.followers.includes(user._id)? 
              <button style={{ margin: "10px"}}
              className="btn waves-effect waves-light #64b5f6 blue darken-1"
              onClick={() => unfollowUser()}
            >
              Unfollow
            </button>
            :
            <button style={{ margin: "10px"}}
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={() => followUser()}
          >
            Follow
          </button>
          }
             
        
            </div>
          </div>
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
