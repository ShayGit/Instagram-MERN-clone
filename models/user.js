const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    }, 
    password:{
        type:String,
        required: true
    },
    image:{
        type:String,
        default: "https://res.cloudinary.com/instagram-clone-mern/image/upload/v1601993920/noUser_vi5a4a.png"
    },
    followers:[{
        type: ObjectId,
        ref:"User"
    }],
    following:[{
        type: ObjectId,
        ref:"User"
    }]
})


mongoose.model("User", userSchema)