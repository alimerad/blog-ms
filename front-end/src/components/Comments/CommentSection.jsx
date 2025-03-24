import CommentSet from "./CommentSet"
import CommentForm from "./CommentForm"
import { useState } from "react"

const CommentSection = (props) => {
  const [sharedCommentState, setSharedCommentState] = useState(props.comments)

  return (
    <>
      <CommentForm
        postState={props.state}
        commentState={sharedCommentState}
        setCommentState={setSharedCommentState}
      />
      <CommentSet
        commentState={sharedCommentState}
        setCommentState={setSharedCommentState}
      />
    </>
  )
}
export default CommentSection
