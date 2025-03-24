import dotenv from "dotenv"
dotenv.config()

const config = {
  port: process.env.PORT,
  db: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      stub: "./src/db/migration.stub",
    },
  },
  security: {
    pepper: process.env.PASSWORD_SECURITY_PEPPER,
    keylen: 128,
    iterations: 100000,
    digest: "sha256",
    session: {
      expiresIn: "2 days",
      secret: process.env.SESSION_SECRET,
    },
  },
}
console.log({ db: config.db })
export default config
