const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireAuth = require("../middleware/requireAuth");



router.get("/allposts",requireAuth, (req, res) => {
    Post.find().populate("postedBy",'_id name image')
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    }).catch(err =>console.log(err))
   
  });

  router.get("/followingPosts",requireAuth, (req, res) => {
    Post.find({postedBy:{$in:req.user.following}}).populate("postedBy",'_id name image')
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    }).catch(err =>console.log(err))
   
  });

router.post("/createpost",requireAuth, (req, res) => {
    const {title,body, image} = req.body;
    console.log(req.body)
    if(!title || !body || !image)
    {
       return res.status(422).json({error: " Please add all the fields"})
    }

    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        image,
        postedBy: req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    }).catch(err =>{
        console.log(err)
    })
  });


  router.get('/myposts',requireAuth, (req,res)=>{
      Post.find({postedBy:req.user._id}).populate("postedBy",'_id name image')
      .populate("comments.postedBy","_id name")
      .sort('-createdAt')
      .then(myposts=>{
            res.json({myposts})
      })
      .catch(err =>{
          console.log(err);
      })
  })

  router.put('/like',requireAuth, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
            $push:{likes: req.user._id}
    },{
        new:true
    }).populate("postedBy",'_id name image')
    .populate("comments.postedBy","_id name").exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            console.log(result)
            res.json(result)
            
        }
    })
})
    router.put('/unlike',requireAuth, (req,res)=>{
        Post.findByIdAndUpdate(req.body.postId,{
                $pull:{likes: req.user._id}
        },{
            new:true
        }).populate("postedBy",'_id name image')
        .populate("comments.postedBy","_id name").exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                res.json(result)
            }
        })
    })

    router.put('/comment',requireAuth, (req,res)=>{
       
        const comment = {
            text: req.body.text,
            postedBy: req.user._id
        }
        console.log(comment)
        Post.findByIdAndUpdate(req.body.postId,{
                $push:{comments: comment}
        },{
            new:true
        }).populate("comments.postedBy","_id name")
        .populate("postedBy","_id name image").exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                console.log(result)
                res.json(result)
                
            }
        })
    })

    router.delete('/deletePost/:postId',requireAuth, (req,res)=>{
       const postId = req.params.postId;
        Post.findOne({_id:postId})
        .populate("postedBy","_id")
        .exec((err,post)=>{
            if(err || !post){
                return res.status(422).json({error:err})
            }
            if(post.postedBy._id.toString() === req.user._id.toString()){
                post.remove().then(result=>{
                    res.json(result)
                }).catch(err=>{
                    console.log(err);
                })
            }
            
        })
    })

router.delete('/deleteComment/:postId&:commentId',requireAuth, async (req,res)=>{
    try {
        console.log(req.params)
        const post = await Post.findById(req.params.postId).populate("comments.postedBy","_id name")
        .populate("postedBy","_id name image");
     
        // Pull out comment
        const commentToDelete = post.comments.find(
          (comment) => comment.id === req.params.commentId
        );
     
        // Make sure comment exists
        if (!commentToDelete) {
          return res.status(404).json({ error: "Comment does not exist" });
        }
     
        // Get remove index
        const removeIndex = post.comments
          .map((comment) => comment.id)
          .indexOf(req.params.commentId);
     
        post.comments.splice(removeIndex, 1);
     
        await post.save();
     
        res.json({ commentToDelete, post });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
});
  
module.exports = router;
