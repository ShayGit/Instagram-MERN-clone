import React, { useContext, useEffect } from "react";

import { Context as AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import M from "materialize-css";

const PostsDashboard = ({ postsData, setPostsData }) => {
  const {
    state: { token, user },
  } = useContext(AuthContext);

  const likePost = async (id) => {
    try {
      const res = await fetch("/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          postId: id,
        }),
      });
      const data = await res.json();
      const updatedDate = postsData.map((item) => {
        if (item._id === data._id) {
          return data;
        } else {
          return item;
        }
      });
      setPostsData(updatedDate);
    } catch (err) {
      console.log(err);
    }
  };

  const unlikePost = async (id) => {
    try {
      const res = await fetch("/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          postId: id,
        }),
      });
      const data = await res.json();
      const updatedDate = postsData.map((item) => {
        if (item._id === data._id) {
          return data;
        } else {
          return item;
        }
      });
      setPostsData(updatedDate);
    } catch (err) {
      console.log(err);
    }
  };

  const makeComment = async (text, postId) => {
    try {
      const res = await fetch("/comment", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          postId,
          text,
        }),
      });
      const data = await res.json();
      console.log(data);
      const updatedDate = postsData.map((item) => {
        if (item._id === data._id) {
          return data;
        } else {
          return item;
        }
      });
      setPostsData(updatedDate);
    } catch (err) {
      console.log(err);
    }
  };

  const deletePost = async (postId) => {
    try {
      const res = await fetch(`/deletePost/${postId}`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const postResult = await res.json();
      const newPostsData = postsData.filter((post) => {
        return post._id !== postResult._id;
      });
      setPostsData(newPostsData);
      if (postResult) {
        M.toast({
          html: "Post deleted successfully",
          classes: "x43a047 green darken-1",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async (postId, commentId) => {
    console.log(postId);
    try {
      const res = await fetch(`/deleteComment/${postId}&${commentId}`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await res.json();
      console.log(data);
      const updatedDate = postsData.map((item) => {
        if (item._id === data.post._id) {
          return data.post;
        } else {
          return item;
        }
      });
      setPostsData(updatedDate);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="home">
      {postsData.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
               
            <h5
              style={{
                fontWeight: 500,
                padding: "6px",
                display: 'flex',
                alignItems: 'center',
                justifyContent:"space-between"
              }}
            >
                
              <Link
                to={
                  user._id !== item.postedBy._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile/"
                }
              >
                  <div style={{display: 'flex', alignItems: 'center'}}>
                  <img
                src={item.postedBy.image}
                style={{
                  margin: "0px 5px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "18px",
                }}
              />
              
                {item.postedBy.name}
                </div>
              </Link>
              {user._id === item.postedBy._id && (
                <i
                  onClick={() => deletePost(item._id)}
                  className="material-icons "
                  style={{ float: "right" }}
                >
                  delete
                </i>
              )}
            </h5>
            <div className="card-image">
              <img src={item.image} />
            </div>
            <div className="card-content">
              {item.likes.includes(user._id) ? (
                <i
                  className="material-icons"
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                  style={{ color: "red" }}
                >
                  favorite
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  favorite_border
                </i>
              )}
              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((comment) => {
                return (
                  <h6 key={comment._id}>
                    <Link
                      to={
                        user._id !== comment.postedBy._id
                          ? "/profile/" + comment.postedBy._id
                          : "/profile/"
                      }
                    >
                      <span style={{ fontWeight: "500" }}>
                        {comment.postedBy.name}
                      </span>{" "}
                    </Link>

                    {comment.text}
                    {comment.postedBy._id === user._id && (
                      <i
                        onClick={() => deleteComment(item._id, comment._id)}
                        className="material-icons small right"
                        style={{ fontSize: "20px" }}
                      >
                        delete
                      </i>
                    )}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                  e.target[0].value = "";
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostsDashboard;
