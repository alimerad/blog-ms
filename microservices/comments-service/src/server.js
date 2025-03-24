import express from "express"
import knex from "knex"
import { Model } from "objection"
import config from "./db/config.js"
import commentsRoute from "./routes/comments.js"
const app = express()
const db = knex(config.db)

Model.knex(db)

app.use(express.json())

commentsRoute({ app })

app.listen(config.port)
