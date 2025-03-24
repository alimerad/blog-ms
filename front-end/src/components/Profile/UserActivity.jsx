import useApi from "src/hooks/useApi"
import CommentSet from "@components/Comments/CommentSet"
import { useState, useEffect } from "react"
import SetPosts from "@components/Posts/PostSet"

const UserActivity = (props) => {
  const { userId } = props
  const [dataComments] = useApi("get", `/users/${userId}/comments`)
  const [dataPosts] = useApi("get", `/users/${userId}/posts/published`)
  const [stateComments, setStateComments] = useState(dataComments)
  const [statePosts, setStatePosts] = useState(dataPosts)

  useEffect(() => {
    setStateComments(dataComments)
  }, [dataComments])

  useEffect(() => {
    setStatePosts(dataPosts)
  }, [dataPosts])

  return (
    <>
      <div className="w-full md:w-2/3 flex flex-col items-center px-3">
        <h2 className="text-2xl font-normal leading-normal mt-0 mb-2 text-pink-800">
          Latest posts
        </h2>
        {!statePosts.length ? (
          <div className="flex justify-center">
            <p className="bg-stone-400 text-white text-center font-bold px-4 py-2 mt-5 w-1/2">
              This user has no posts yet
            </p>
          </div>
        ) : (
          <SetPosts {...props} />
        )}
      </div>
      <aside className="w-full md:w-1/3 flex flex-col items-center px-3">
        <h2 className="text-2xl font-normal leading-normal mt-0 mb-2 text-pink-800">
          Latest comments
        </h2>
        <div
          className={`w-full ${
            !stateComments.length ? "" : "bg-white"
          } shadow flex flex-col my-4 p-6`}
        >
          {!stateComments.length ? (
            <div className="flex justify-center">
              <p className="bg-stone-400 text-white text-center font-bold px-4 py-2 mt-5 w-1/2">
                This user has no comments yet
              </p>
            </div>
          ) : (
            <CommentSet
              commentState={stateComments.slice(0, 5)}
              setCommentState={setStateComments}
            />
          )}
        </div>
      </aside>
    </>
  )
}
export default UserActivity
