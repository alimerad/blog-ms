import authentication from "../middleware/authentication.js"
import PostsModel from "../models/posts.js"
import checkSession from "../middleware/checkSession.js"
import CommentsModel from "../models/comments.js"
import UsersModel from "../models/users.js"

const postsRoute = ({ app }) => {
  app.post("/posts", authentication, checkSession, async (req, res) => {
    const {
      body: { title, description, userId, statePostId },
    } = req

    try {
      const user = await UsersModel.query().findById(userId)

      if (!user) {
        res.status(401).send({ error: "User not found" })
        return
      }

      const post = await PostsModel.query().insertAndFetch({
        title,
        description,
        userId,
        statePostId,
      })
      res.send(post)
    } catch (err) {
      res.send({ message: err.message })
    }
  })

  app.get("/posts", async (req, res) => {
    try {
      const posts = await PostsModel.query()
        .select(
          "posts.id",
          "title",
          "createdAt",
          "description",
          "userId",
          "users.displayName as author"
        )
        .join("users", "users.id", "posts.userId")
        .orderBy("posts.id", "desc")
      res.send(posts)
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  })

  app.get("/posts/:statePost", async (req, res) => {
    const {
      params: { statePost },
    } = req
    try {
      const posts = await PostsModel.query()
        .join("users", "users.id", "posts.userId")
        .join("statePosts", "statePosts.id", "posts.statePostId")
        .select(
          "posts.id",
          "title",
          "createdAt",
          "description",
          "userId",
          "users.displayName as author",
          "statePosts.label as statePost"
        )
        .where("statePosts.label", statePost)
        .orderBy("posts.id", "desc")

      res.send(posts)
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  })

  app.get("/post/:postId", async (req, res) => {
    const {
      params: { postId },
    } = req

    if (postId === "undefined") {
      return
    }
    try {
      const post = await PostsModel.query()
        .select(
          "posts.id",
          "title",
          "createdAt",
          "description",
          "userId",
          "users.displayName as author",
          "statePosts.label as statePost"
        )
        .join("users", "users.id", "posts.userId")
        .join("statePosts", "statePosts.id", "posts.statePostId")
        .findById(postId)

      if (!post) {
        res.status(404).send({ message: "Post not found" })

        return
      }
      res.send(post)
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  })

  app.put("/posts/:postId", authentication, async (req, res) => {
    const {
      params: { postId },
      body: { title, description, userId, statePostId, createdAt },
      session: { userId: sessionUserId },
    } = req

    try {
      const post = await PostsModel.query().findById(postId)
      const senderUser = await UsersModel.query()
        .select("rights.label as right")
        .join("rights", "rights.id", "users.rightId")
        .findById(sessionUserId)

      if (post.userId !== userId && senderUser.right !== "admin") {
        res.status(400).send({ message: "Forbidden" })

        return
      }

      let payload = Object.assign(
        {},
        title && { title },
        description && { description },
        statePostId && { statePostId }
      )

      await PostsModel.query().updateAndFetchById(postId, payload)

      const updatedPost = await PostsModel.query()
        .select(
          "posts.id",
          "title",
          "createdAt",
          "description",
          "userId",
          "users.displayName as author",
          "statePosts.label as statePost"
        )
        .join("users", "users.id", "posts.userId")
        .join("statePosts", "statePosts.id", "posts.statePostId")
        .findById(postId)

      res.send(updatedPost)
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  })

  app.delete("/posts/:postId", authentication, async (req, res) => {
    const {
      params: { postId },
      session: { userId: sessionUserId },
    } = req

    try {
      const post = await PostsModel.query().findById(postId)
      const senderUser = await UsersModel.query()
        .select("rights.label as right")
        .join("rights", "rights.id", "users.rightId")
        .findById(sessionUserId)

      if (!post) {
        res.status(404).send({ message: "Post does not exists." })

        return
      }

      if (post.userId !== sessionUserId && senderUser.right !== "admin") {
        res.status(401).send({ message: "Forbidden" })

        return
      }

      await PostsModel.query().deleteById(postId)
      res.send({ message: "Post deleted successfully." })
    } catch (message) {
      res.send(message)
    }
  })
  app.get("/posts/:postId/comments", async (req, res) => {
    const {
      params: { postId },
    } = req
    try {
      const comments = await CommentsModel.query()
        .where({ postId: Number(postId) })
        .select(
          "comments.id",
          "content",
          "postedAt",
          "userId",
          "postId",
          "users.displayName as author"
        )
        .orderBy("postedAt", "desc")
        .join("users", "users.id", "comments.userId")
      res.send(comments)
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  })
}
export default postsRoute
