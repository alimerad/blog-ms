import express from "express"
import knex from "knex"
import { Model } from "objection"
import config from "./db/config.js"
import postsRoute from "./routes/posts.js"

const app = express()
const db = knex(config.db)

Model.knex(db)

app.use(express.json())

postsRoute({ app })

app.listen(config.port, () => console.log(config.port))
