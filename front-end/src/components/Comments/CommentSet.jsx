import Comment from "./Comment"
import { v4 as uuidv4 } from "uuid"

const CommentSet = (props) => {
  const { commentState, setCommentState } = props

  
return (
    <div className="container mx-1/2 flex flex-wrap">
      {Object.values(commentState).map((comment) => (
        <Comment key={uuidv4()} state={comment} setData={setCommentState} />
      ))}
    </div>
  )
}
export default CommentSet
