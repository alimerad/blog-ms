import express from "express"
import knex from "knex"
import { Model } from "objection"
import config from "./db/config.js"
import authenticationRoute from "./routes/authentication.js"
import usersRoute from "./routes/users.js"
import pendingApplicationRoute from "./routes/pendingApplication.js"
const app = express()
const db = knex(config.db)

Model.knex(db)

app.use(express.json())

usersRoute({ app })
authenticationRoute({ app })
pendingApplicationRoute({ app })
app.listen(config.port, () => console.log(config.port))
