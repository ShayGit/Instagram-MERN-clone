const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys')
const requireAuth = require('../middleware/requireAuth')

router.get("/", (req, res) => {
  res.send("hello");
});

router.get("/protected", requireAuth, (req, res) => {
    res.send("hello user");
  });

router.post("/signup", (req, res) => {
  const { name, email, password, image } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "user already exists with that email" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          name,
          image
        });

        user
          .save()
          .then((user) => {
            res.json({ message: "saved successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.post('/signin', (req,res)=>{
    let {email,password} =  req.body;

    if(!email || !password){
        return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email}).then(savedUser=>{
        if(!savedUser){
            res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password).then(isMatch =>{
            if(isMatch){
               // res.json({message: "successfully signed in"})
            const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
            const {_id,name,email,image,followers, following} =savedUser;
              console.log(savedUser)
            res.json({token, user:{_id,name,email,followers,following, image}})

        }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        }).catch(err=>{
            console.log(err);
        })
    }).catch(err=>{
        console.log(err);
    })
})


module.exports = router;
