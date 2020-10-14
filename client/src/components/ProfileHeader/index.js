import "./styles.css";

import React, { useContext, useEffect, useState } from "react";

import { Context as AuthContext } from "../../context/AuthContext";

const ProfileHeader = ({
  userInput,
  postsNumber,
  isMyProfile,
  updatePhoto,
  setLoading,
  unfollowUser,
  followUser
}) => {
    const {
        state: { user },
      } = useContext(AuthContext);

  return (
    <div className="container-profile">
      <div className="details">
        <div className="image-container">
          <img
            src={userInput.image}
            style={{ width: "150px", height: "150px", borderRadius: "75px" }}
          />
          {isMyProfile &&(
          <div className="file-field  update-photo">
              <i className=" material-icons  update-photo">add_circle
              <input type="file" onChange={(e) => {
                     setLoading(true);
                     updatePhoto(e.target.files[0]);
                     e.target.value = null;}} />
              </i>
          </div>
          )}
        </div>
        <div className="data">
          <b>{postsNumber}</b>
          <div>Posts</div>
        </div>
        <div className="data">
          <b>{userInput.followers.length}</b>
          <div>Followers</div>
        </div>
        <div className="data">
          <b>{userInput.following.length}</b>
          <div>Following</div>
        </div>
      </div>
      <div className="bio">
        <h6>
          <b>{userInput.name}</b>
        </h6>
          <h6>asda{userInput.bio}</h6>
      </div>
      {isMyProfile ?(
            <div className="edit-info">
            <button style={{ margin: "10px", width:'80%'}}
            className=" btn waves-effect waves-light  #fafafa grey lighten-5"
            onClick={() => {}}
          >
            <b style={{color: 'black'}}>Edit Profile</b>
          </button>
          </div>
      ): (
          <>
          <div className="details"> 
          {userInput.followers.includes(user._id)? 
        <div className="follow-button">
              <button style={{ margin: "10px", width:'100%'}}
              className="btn waves-effect waves-light #64b5f6 blue darken-1"
              onClick={() => {unfollowUser()}}
            >
              Unfollow
            </button>
            </div>
            :
            <div className="follow-button">
            <button style={{ margin: "10px", width:'100%'}}
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={() => followUser()}
          >
            Follow
          </button>
          </div>
        }
         <div className="edit-info" >
            <button
            style={{width: '100%'}}
            className="btn waves-effect waves-light  #fafafa grey lighten-5"
            onClick={() => {}}
          >
            <b style={{color: 'black'}}>Send Message</b>
          </button>
          </div>
        </div>
        </>
        )
        }
   
    </div>
  );
};

export default ProfileHeader;
