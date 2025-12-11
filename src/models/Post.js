import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  owner: String,
  content: String,
  date: String
})

const PostSchema = new mongoose.Schema({
  owner: String,
  title: String,
  content: String,
  date: String,
  comments: [CommentSchema],
  likes: [String]
})

export const PostModel = mongoose.model("Post", PostSchema)