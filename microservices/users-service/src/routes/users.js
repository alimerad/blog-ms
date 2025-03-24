import UsersModel from "../models/users.js"
import authentication from "../middleware/authentication.js"
import CommentsModel from "../models/comments.js"
import PostsModel from "../models/posts.js"

const usersRoute = ({ app }) => {
  app.get("/users", async (req, res) => {
    try {
      const users = await UsersModel.query()
        .select("users.id", "email", "displayName", "rights.label as right")
        .join("rights", "rights.id", "users.rightId")
      res.send(users)
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  })

  app.get("/users/:userId", async (req, res) => {
    const {
      params: { userId },
    } = req

    if (userId === "null") {
      return
    }

    try {
      const user = await UsersModel.query()
        .select("users.id", "email", "displayName", "rights.label as right")
        .join("rights", "rights.id", "users.rightId")
        .findById(userId)

      if (!user) {
        res.status(404).send({ message: "User not found" })

        return
      }
      res.send(user)
    } catch (err) {
      res.status(404).send({ message: err.message })
    }
  })

  app.get("/users/:userId/comments", async (req, res) => {
    const {
      params: { userId },
    } = req

    if (!userId.length) {
      return
    }

    try {
      const comments = await CommentsModel.query()
        .where({ userId })
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

  app.get("/users/:userId/posts/:statePost", async (req, res) => {
    const {
      params: { userId, statePost },
    } = req
    try {
      const posts = await PostsModel.query()
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
        .where("statePosts.label", statePost)
        .where({ userId })
        .orderBy("posts.id", "desc")

      res.send(posts)
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  })

  app.put("/users/:userId", authentication, async (req, res) => {
    const {
      params: { userId },
      body: { email, displayName, password, rightId },
    } = req

    if (typeof userId === "undefined") {
      return
    }

    try {
      const user = await UsersModel.query().findById(userId)

      if (!user) {
        res.status(404).send({ message: "User not found." })

        return
      }

      let payload = Object.assign(
        {},
        password && { password },
        displayName && { displayName },
        email && { email },
        rightId && { rightId },
        password && { password }
      )

      const updatedUser = await UsersModel.query().updateAndFetchById(
        userId,
        payload
      )

      const fetchedUser = await UsersModel.query()
        .select("users.id", "email", "displayName", "rights.label as right")
        .join("rights", "rights.id", "users.rightId")
        .findById(updatedUser.id)

      res.send(fetchedUser)
    } catch (err) {
      res.status(401).send({ message: err.message })
    }
  })

  app.delete("/users/:userId", authentication, async (req, res) => {
    const {
      params: { userId },
      session: { userId: sessionUserId },
    } = req

    try {
      const senderUser = await UsersModel.query()
        .select("rights.label as right")
        .join("rights", "rights.id", "users.rightId")
        .findById(sessionUserId)

      if (typeof userId === "undefined") {
        return
      }

      if (sessionUserId !== Number(userId) && senderUser.right !== "admin") {
        res.status(400).send({ message: "An error has occured" })
      }

      const userToDelete = await UsersModel.query().findById(userId)

      if (userToDelete.rightId === 3) {
        res.status(401).send({ message: "Cannot delete Admin." })

        return
      }

      await UsersModel.query().deleteById(userId)
      res.send({ message: "User deleted successfully" })
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  })
}

export default usersRoute
