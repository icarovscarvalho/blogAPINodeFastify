import { isAuth } from '../middlewares/is-auth.js'
import { PostModel } from '../models/Post.js'
import mongoose from 'mongoose'

export async function postsRoutes(app) {

  // ================================
  // GET ALL POSTS
  // ================================
  app.get('/posts', { onRequest: [isAuth] }, async (request, reply) => {
    const allPosts = await PostModel.find().sort({ date: -1 })
    return reply.status(200).send(allPosts)
  })

  // ================================
  // CREATE POST
  // ================================
  app.post('/posts', { onRequest: [isAuth] }, async (request, reply) => {
    const { username, title, content } = request.body

    const newPost = await PostModel.create({
      owner: username,
      title,
      content,
      date: new Date().toISOString(),
      comments: [],
      likes: []
    })

    return reply.status(201).send(newPost)
  })

  // ================================
  // ADD COMMENT
  // ================================
  app.post('/posts/:id/comment', { onRequest: [isAuth] }, async (request, reply) => {
    const { id } = request.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return reply.status(400).send({ message: "Invalid post ID" })
    }

    const post = await PostModel.findById(id)
    if (!post) return reply.status(404).send({ message: "Post not found" })

    const { username, content } = request.body

    const comment = {
      owner: username,
      content,
      date: new Date().toISOString(),
    }

    post.comments.push(comment)
    await post.save()

    return reply.status(200).send(post)
  })

  // ================================
  // LIKE / DISLIKE POST
  // ================================
  app.patch('/posts/:id/like', { onRequest: [isAuth] }, async (request, reply) => {
    const { id } = request.params
    const { username } = request.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return reply.status(400).send({ message: "Invalid post ID" })
    }

    const post = await PostModel.findById(id)
    if (!post) return reply.status(404).send({ message: "Post not found" })

    const alreadyLiked = post.likes.includes(username)

    if (alreadyLiked) {
      // remove like
      post.likes = post.likes.filter(user => user !== username)
    } else {
      // add like
      post.likes.push(username)
    }

    await post.save()

    return reply.status(200).send(post)
  })

  // ================================
  // DELETE POST (only owner)
  // ================================
  app.delete('/posts/:id', { onRequest: [isAuth] }, async (request, reply) => {
    const { id } = request.params
    const { username } = request.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return reply.status(400).send({ message: "Invalid post ID" })
    }

    const post = await PostModel.findById(id)
    if (!post) return reply.status(404).send({ message: "Post not found" })

    if (post.owner !== username) {
      return reply.status(403).send({ message: "User is not the owner of this post" })
    }

    await PostModel.findByIdAndDelete(id)
    return reply.status(204).send()
  })
}
