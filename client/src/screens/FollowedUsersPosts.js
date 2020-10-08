import React, { useContext, useEffect, useState } from "react";

import { Context as AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import M from "materialize-css";
import PostsDashboard from "../components/PostsDashboard";

const FollowedUsersPosts = () => {
  const [postsData, setPostsData] = useState([]);

  const {
    state: { token },
  } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/followingPosts", {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      return data.posts;
    };
    fetchPosts().then((posts) => {
      setPostsData(posts);
    });

    return () => {};
  }, []);


  return (
    <PostsDashboard postsData={postsData} setPostsData={setPostsData}/>
  )
};

export default FollowedUsersPosts;
