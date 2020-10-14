const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        set: toLower
    }, 
    password:{
        type:String,
        required: true
    },
    resetToken:String,
    expireToken:Date,
    image:{
        type:String,
        default: "https://res.cloudinary.com/instagram-clone-mern/image/upload/v1601993920/noUser_vi5a4a.png"
    },
    bio:{
        type:String,
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

function toLower (str) {
    return str.toLowerCase();
}

mongoose.model("User", userSchema)