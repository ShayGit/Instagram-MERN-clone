const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requireAuth = require("../middleware/requireAuth");
const User = mongoose.model("User");

router.get('/user/:id', requireAuth,async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId).select("-password");
        const posts = await Post.find({postedBy:userId}).populate("postedBy","_id name")
        res.json({user,posts});
        
    }
    catch(err){
        return res.status(404).json({error:err})
    }
    
})

router.put('/follow', requireAuth, async (req, res) => {
    try{
        const userToFollow = await User.findByIdAndUpdate(req.body.followId,
            {
                $push:{followers: req.user._id}
            },{
                new: true
            }).select("-password")
            const userFollowing = await User.findByIdAndUpdate(req.user._id,
                {
                    $push:{following: req.body.followId}
                },
                {
                    new: true
                }).select("-password")
                res.json({userFollowing,userToFollow})
    }
    catch(err){
        return res.status(422).json({error:err})
    }
    
})

router.put('/unfollow', requireAuth, async (req, res) => {
    try{
        const userToUnfollow = await User.findByIdAndUpdate(req.body.unfollowId,
            {
                $pull:{followers: req.user._id}
            },{
                new: true
            }).select("-password")
            const userUnfollowing = await User.findByIdAndUpdate(req.user._id,
                {
                    $pull:{following: req.body.unfollowId}
                },
                {
                    new: true
                }).select("-password")
                res.json({userUnfollowing,userToUnfollow})
    }
    catch(err){
        return res.status(422).json({error:err})
    }
    
})

router.put('/updateImage', requireAuth, async (req, res)=>{
    try{
        const result = await User.findByIdAndUpdate(req.user._id,
            {$set: {image: req.body.image}},
            {new: true}).select("-password");
            res.json(result);
    }
   catch(err){
    return res.status(422).json({error:"cannot update photo"});

   }
})

router.post('/searchUsers', requireAuth, async (req, res)=>{
    try{
        let userPattern = new RegExp("^"+req.body.query)

        const users = await User.find({email:{$regex:userPattern}}).select("_id email");
        res.json({users});
    }
   catch(err){
    console.log(err);
   }
})
module.exports = router;