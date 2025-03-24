import { Model } from "objection"
import UsersModel from "./users.js"

class PendingApplicationModel extends Model {
  static tableName = "pendingAuthorDemand"

  static relationMappings = {
    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: UsersModel,
      join: {
        from: "pendingAuthorDemand.userId",
        to: "users.id",
      },
    },
  }
}
export default PendingApplicationModel
