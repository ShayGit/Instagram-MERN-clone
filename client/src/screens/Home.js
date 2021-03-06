import React, { useContext, useEffect, useState } from "react";

import { Context as AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import M from "materialize-css";
import PostsDashboard from "../components/PostsDashboard";

const Home = () => {
  const [postsData, setPostsData] = useState([]);

  const {
    state: { token,user },
  } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      // const res = await fetch("/allposts", {
      //   headers: { Authorization: "Bearer " + token },
      // });
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


  return(
    (user && postsData) ?
    <PostsDashboard postsData={postsData} setPostsData={setPostsData}/>
    :
    null
    )
};

export default Home;
