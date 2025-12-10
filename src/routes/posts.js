import { isAuth } from '../middlewares/is-auth.js'
import { posts } from '../db/posts.js'

export async function postsRoutes(app) {
  app.get('/posts', { onRequest: [isAuth] },(request, reply) => {
    return reply.status(200).send(posts)
  })

  app.post('/posts', { onRequest: [isAuth] },(request, reply) => {
    const { username, title, content } = request.body

    const post = {
      id: posts.length + 1,
      owner: username,
      title,
      content,
      date: new Date().toISOString(),
      comments: [],
      likes: []
    }

    posts.push(post)

    return reply.status(200).send(posts)
  })

  app.post('/posts/:id/comment', { onRequest: [isAuth] },(request, reply) => {
    const { id } = request.params

    const postIndex = posts.findIndex(post => post.id === +id)

    if(postIndex === -1) {
      return reply.status(404).send({ message: "Post not found" })
    }

    const { username, content } = request.body

    const comment = {
      owner: username,
      content,
      date: new Date().toISOString(),
    }

    posts[postIndex].comments.push(comment)

    return reply.status(200).send(posts[postIndex])
  })

  app.patch('/posts/:id/like', { onRequest: [isAuth] },(request, reply) => {
    const { id } = request.params

    const postIndex = posts.findIndex(post => post.id === +id)

    if(postIndex === -1) {
      return reply.status(404).send({ message: "Post not found" })
    }

    const { username } = request.body

    const likeIndex = posts[postIndex].likes.findIndex(item => item === username)

    if(likeIndex >= 0) {
      posts[postIndex].likes.splice(likeIndex, 1)

      return reply.status(200).send(posts[postIndex])
    }

    posts[postIndex].likes.push(username)

    return reply.status(200).send(posts[postIndex])
  })

  app.delete('/posts/:id', { onRequest: [isAuth] },(request, reply) => {
    const { id } = request.params

    const postIndex = posts.findIndex(post => post.id === +id)

    if(postIndex === -1) {
      return reply.status(404).send({ message: "Post not found" })
    }

    const { username } = request.body

    if(username !== posts[postIndex].owner) {
      return reply.status(400).send({ message: "Currently user isn't the post owner!"})
    }

    posts.splice(postIndex, 1)

    return reply.status(204).send()
  })
}