import { Model } from "objection"
import PostsModel from "./posts.js"
import UsersModel from "./users.js"

class CommentsModel extends Model {
  static tableName = "comments"

  static relationMappings = {
    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: UsersModel,
      join: {
        from: "comments.userId",
        to: "users.id",
      },
    },
    affiliatePost: {
      relation: Model.BelongsToOneRelation,
      modelClass: PostsModel,
      join: {
        from: "comments.postId",
        to: "posts.id",
      },
    },
  }
}
export default CommentsModel
