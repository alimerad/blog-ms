import config from "../db/config.js"
import { pbkdf2Sync, randomBytes } from "crypto"

const { pepper, keylen, iterations, digest } = config.security

const hashPassword = (password, salt = randomBytes(128).toString("hex")) => [
  pbkdf2Sync(password, salt + pepper, iterations, keylen, digest).toString(
    "hex"
  ),
  salt,
]
export default hashPassword
