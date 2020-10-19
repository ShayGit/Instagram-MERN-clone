import "./styles.css";

import { Link, useParams } from "react-router-dom";

import { BiArrowBack } from "react-icons/bi";
import PostsDashboard from "../PostsDashboard";
import React from "react";
import history from '../../modules/history'

const ProfilePostsDashboard = ({ posts, setPosts }) => {

    const params = useParams();
    
    
  return (
    <div>
        <BiArrowBack className="icon" onClick={()=>history.goBack()} />
      
      <div className="posts-container">
        <PostsDashboard postsData={posts} setPostsData={setPosts} />
      </div>
    </div>
  );
};

export default ProfilePostsDashboard;
