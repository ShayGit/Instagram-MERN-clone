import React, { useContext, useEffect, useState } from "react";
import { Switch, useParams } from "react-router-dom";

import { Context as AuthContext } from "../context/AuthContext";
import Gallery from "../components/Gallery";
import PrivateRoute from "../components/PrivateRoute";
import ProfileHeader from "../components/ProfileHeader";
import ProfilePostsDashboard from "../components/ProfilePostsDashboard";

const UserProfile = () => {
  const {
    state: { token, user },
    updateUserFollow,
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

  const followUser = async () => {
    const res = await fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        followId: userId,
      }),
    });
    const data = await res.json();
    updateUserFollow({
      followers: data.userFollowing.followers,
      following: data.userFollowing.following,
    });
    localStorage.setItem("user", JSON.stringify(data.userFollowing));
    setUserProfile((prevState) => {
      return { ...prevState, user: { ...data.userToFollow } };
    });
  };

  const unfollowUser = async () => {
    const res = await fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    });
    const data = await res.json();
    updateUserFollow({
      followers: data.userUnfollowing.followers,
      following: data.userUnfollowing.following,
    });
    localStorage.setItem("user", JSON.stringify(data.userUnfollowing));
    setUserProfile((prevState) => {
      return { ...prevState, user: { ...data.userToUnfollow } };
    });
    console.log(data);
  };
  const GalleryType = () => {
    return (
      <Switch>
        <PrivateRoute exact path="/profile/:userId">
          <Gallery posts={userProfile.posts} />
        </PrivateRoute>
        <PrivateRoute exact path="/profile/:userId/image/:imageIndex">
          <ProfilePostsDashboard
            posts={userProfile.posts}
            setPosts={(posts) =>
              setUserProfile({ user: { ...userProfile.user }, posts: posts })
            }
          />
        </PrivateRoute>
      </Switch>
    );
  };
  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "600px", margin: "0px auto" }}>
          <ProfileHeader
            isMyProfile={false}
            followUser={followUser}
            unfollowUser={unfollowUser}
            userInput={userProfile.user}
            postsNumber={userProfile.posts.length}
          />
          <GalleryType />
        </div>
      ) : (
        <h2 className="loading"> loading... </h2>
      )}
    </>
  );
};

export default UserProfile;
