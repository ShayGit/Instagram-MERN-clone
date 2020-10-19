import './styles.css'

import { Link, useLocation } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";

import { Context as AuthContext } from "../../context/AuthContext";

const Gallery = ({posts})=>{
  const location = useLocation();

    return( 
     <div className="gallery">
    {posts.map((post, index) => {
      return (
        <Link to={`${location.pathname}/image/${index}`} key={post._id}>
        <img
          key={post._id}
          alt={post.title}
          className="item"
          src={post.image}
        />
        </Link>
      );
    })}
  </div>)
}


export default Gallery;
