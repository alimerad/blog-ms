import jsonwebtoken from "jsonwebtoken"
import hashPassword from "../middleware/hashPassword.js"
import UsersModel from "../models/users.js"
import config from "../db/config.js"

const authenticationRoute = ({ app }) => {
  app.post("/sign-in", async (req, res) => {
    const {
      body: { email, password },
    } = req

    try {
      if (!email || !password) {
        res.status(401).send({ message: "email or password invalid" })

        return
      }

      const user = await UsersModel.query()
        .select(
          "users.id",
          "email",
          "displayName",
          "passwordHash",
          "passwordSalt",
          "rights.label as right"
        )
        .join("rights", "rights.id", "users.rightId")
        .findOne({ email })

      if (user.right === "banned") {
        res
          .send(401)
          .send({ message: "Your account has been banned. You can't connect" })

        return
      }
      if (!user) {
        res.status(401).send({ message: "email or password invalid" })

        return
      }
      const [hashedPassword] = hashPassword(password, user.passwordSalt)
      if (hashedPassword != user.passwordHash) {
        res.status(401).send({ message: "email or password invalid" })

        return
      }

      const jwt = jsonwebtoken.sign(
        { payload: { userId: user.id } },
        config.security.session.secret,
        { expiresIn: config.security.session.expiresIn }
      )

      res.send({ sessionUserId: user.id, jwt, userRight: user.right })
    } catch (err) {
      res.status(400).send({ message: err.message })
    }
  })

  app.post("/sign-up", async (req, res) => {
    const {
      body: { email, displayName, password },
    } = req

    try {
      const [passwordHash, passwordSalt] = hashPassword(password)

      const user = await UsersModel.query().insertAndFetch({
        email,
        displayName,
        passwordHash,
        passwordSalt,
      })

      const jwt = jsonwebtoken.sign(
        { payload: { userId: user.id } },
        config.security.session.secret,
        { expiresIn: config.security.session.expiresIn }
      )
      res.send({ sessionUserId: user.id, jwt })
    } catch (err) {
      res.status(401).send({ message: err })
    }
  })
}
export default authenticationRoute
