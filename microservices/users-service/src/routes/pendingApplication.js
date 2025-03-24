import UsersModel from "../models/users.js"
import authentication from "../middleware/authentication.js"
import PendingApplicationModel from "../models/pendingAuthorDemand.js"

const pendingApplicationRoute = ({ app }) => {
  app.get("/applications", authentication, async (req, res) => {
    try {
      const applications = await PendingApplicationModel.query()
        .select(
          "applicationDate",
          "userId",
          "pendingAuthorDemand.id",
          "users.displayName as author"
        )
        .join("users", "users.id", "pendingAuthorDemand.userId")
      res.send(applications)
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  })

  app.post("/applications/manage", authentication, async (req, res) => {
    const {
      body: { applicationId, validatedApplication },
      session: { userId: sessionUserId },
    } = req

    try {
      if (!validatedApplication) {
        await PendingApplicationModel.query().deleteById(applicationId)

        const applications = await PendingApplicationModel.query()
          .select(
            "applicationDate",
            "userId",
            "pendingAuthorDemand.id",
            "users.displayName as author"
          )
          .join("users", "users.id", "pendingAuthorDemand.userId")

        res.send(applications)

        return
      }

      const senderUser = await UsersModel.query()
        .select("users.id", "email", "displayName", "rights.label as right")
        .join("rights", "rights.id", "users.rightId")
        .findById(sessionUserId)

      if (senderUser.right !== "admin") {
        res.status(400).send({ message: "Forbidden" })

        return
      }

      const application = await PendingApplicationModel.query().findById(
        applicationId
      )

      if (!application) {
        res.status(404).send({ message: "Application not found" })

        return
      }

      const updatedUser = await UsersModel.query().updateAndFetchById(
        application.userId,
        { rightId: 2 }
      )

      if (!updatedUser) {
        res.status(400).send()

        return
      }

      await PendingApplicationModel.query().deleteById(applicationId)

      const applications = await PendingApplicationModel.query()
        .select(
          "applicationDate",
          "userId",
          "pendingAuthorDemand.id",
          "users.displayName as author"
        )
        .join("users", "users.id", "pendingAuthorDemand.userId")

      res.send(applications)
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  })

  app.post("/applications", authentication, async (req, res) => {
    const {
      body: { userId },
    } = req
    try {
      const user = UsersModel.query().findById(userId)

      if (!user) {
        res.status(404).send({ message: "User not found" })

        return
      }

      const pendingDemand =
        await PendingApplicationModel.query().insertAndFetch({
          userId,
        })
      res.send(pendingDemand)
    } catch (err) {
      res.status(401).send({ message: err.message })
    }
  })
  app.get("/applications/:userId", authentication, async (req, res) => {
    const {
      params: { userId },
      session: { userId: sessionUserId },
    } = req

    try {
      if (Number(userId) !== sessionUserId) {
        res.status(401).send({ message: "Session mismatching" })

        return
      }
      const user = await UsersModel.query()
        .select("rights.label as right")
        .join("rights", "rights.id", "users.rightId")
        .findById(userId)
      if (user.right !== "reader") {
        res.status(400).send({ message: "User already have author rights." })

        return
      }

      const application = await PendingApplicationModel.query().findOne({
        userId,
      })

      if (!application) {
        res
          .status(404)
          .send({ message: "Any application not found for this user." })

        return
      }
      res.send(application)
    } catch (err) {
      res.status(401).send({ message: err.message })
    }
  })
}
export default pendingApplicationRoute
