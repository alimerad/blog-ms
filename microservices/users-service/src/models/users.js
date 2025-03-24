import { Model } from "objection"
import RightsModel from "./rights.js"

class UsersModel extends Model {
  static tableName = "users"

  static relationMappings = {
    right: {
      relation: Model.BelongsToOneRelation,
      modelClass: RightsModel,
      join: {
        from: "users.rightId",
        to: "rights.id",
      },
    },
  }
}
export default UsersModel
