const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  likes:[
    {
      type:ObjectId,
    ref: "User"
  }],
  comments:[
    {
      text:String,
      postedBy: {
        type: ObjectId,
        ref: "User",
      },
  }]
},{timestamps:true});

mongoose.model("Post", postSchema);
