import { Model } from "objection"
import UsersModel from "./users.js"

class PostsModel extends Model {
  static tableName = "posts"

  static isOwnedBy(userId) {
    return this.idColumn === userId
  }

  static relationMappings = {
    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: UsersModel,
      join: {
        from: "posts.userId",
        to: "users.id",
      },
    },
  }
}
export default PostsModel
