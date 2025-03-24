import authentication from "../middleware/authentication.js"
import CommentsModels from "../models/comments.js"
import UsersModel from "../models/users.js"

const commentsRoute = ({ app }) => {
  app.post("/comments", authentication, async (req, res) => {
    const {
      body: { content, userId, postId },
    } = req

    try {
      const comment = await CommentsModels.query().insertAndFetch({
        content,
        userId: Number(userId),
        postId: Number(postId),
      })

      res.send(comment)
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  })

  app.put("/comments/:commentId", authentication, async (req, res) => {
    const {
      params: { commentId },
      body: { content, userId },
      session: { userId: sessionUserId },
    } = req

    try {
      if (userId !== sessionUserId) {
        res.status(401).send({ message: "Session mismatching..." })

        return
      }

      const comment = await CommentsModels.query().findById(commentId)

      if (!comment) {
        res.status(404).send({ message: "Comment does not exists anymore." })

        return
      }

      const updatedComment = await CommentsModels.query().updateAndFetchById(
        commentId,
        { content }
      )

      res.send(updatedComment)
    } catch (message) {
      res.send(message)
    }
  })

  app.delete("/comments/:commentId", authentication, async (req, res) => {
    const {
      params: { commentId },
      session: { userId: sessionUserId },
    } = req

    try {
      const comment = await CommentsModels.query().findById(Number(commentId))
      const senderUserRight = await UsersModel.query()
        .select("rights.label as right")
        .join("rights", "rights.id", "users.rightId")
        .findById(sessionUserId)

      if (!comment) {
        res.status(404).send({ message: "Comment not found" })

        return
      }

      if (
        comment.userId !== sessionUserId &&
        senderUserRight.right !== "admin"
      ) {
        res.status(401).send({ message: "Forbidden" })

        return
      }

      await CommentsModels.query().deleteById(commentId)
      res.status(200).send({ message: "Comment deleted successfully." })
    } catch (message) {
      res.send(message)
    }
  })
}
export default commentsRoute
