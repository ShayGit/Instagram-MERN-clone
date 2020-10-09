const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const requireAuth = require('../middleware/requireAuth')
const {JWT_SECRET, SENDGRID_API, BASE_URL, EMAIL} = require('../config/keys')


const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key: SENDGRID_API
  }
}))


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
            transporter.sendMail({ 
              to: user.email,
              from: EMAIL,
              subject: "Signup success",
              html: "<h1>Welcome to instagram clone! Have a good time.</h1>"
            })
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

router.post("/resetPassword", (req, res)=> {
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({email:req.body.email})
    .then(user=>{
      if(!user){
        return res.status(422).json({error: "User does not exists for that email"})
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result)=>{
        transporter.sendMail({
          to: user.email,
          from: EMAIL,
          subject: "Password reset",
          html: `<p>You requested a password reset</p>
          <h5>click on this <a href="${BASE_URL}/reset/${token}">link</a> to reset your password</h5>
          `
        })
        res.json({message:"check your email"})
      })
    })
  })
})

router.post("/updatePassword", async(req, res)=>{
const newPassword = req.body.password;
const sentToken = req.body.token;
const user = await User.findOne({resetToken:sentToken, expireToken:{$gt:Date.now()}})
if(!user){
return res.status(422).json({error: "Try again session expired"});
}
const hashedpassword = await bcrypt.hash(newPassword,12);
user.password = hashedpassword;
user.resetToken = undefined;
user.expireToken = undefined;
const savedUser = await user.save();
res.json({message:"password updated successfully"})
})
module.exports = router;
