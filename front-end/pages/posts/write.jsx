import { useContext, useEffect, useState } from "react"
import { AppContext } from "@components/Context/AppContext"
import WritePost from "@components/Posts/WritePost"
import Router from "next/router"
import SetPosts from "@components/Posts/PostSet"
import useApi from "src/hooks/useApi"

const WritePostPage = () => {
  const { sessionRightUser, sessionUserId } = useContext(AppContext)
  const [err, data] = useApi("get", `/users/${sessionUserId}/posts/drafted`)
  const [postState, setPostState] = useState(data)

  useEffect(() => {
    if (
      (Router.isReady && !sessionRightUser) ||
      sessionRightUser === "reader"
    ) {
      Router.push("/")
    }
  }, [])

  useEffect(() => {
    if (err) {
      return
    }

    setPostState(data)
  }, [data])

  return (
    <>
      <WritePost postState={postState} setPostState={setPostState} />
      <h2 className="text-3xl font-semibold text-center mt-5 leading-normal mt-0 mb-2 text-black-800">
        Drafted Posts
      </h2>
      <SetPosts
        userId={sessionUserId}
        isPublished={false}
        postState={postState}
        setPostState={setPostState}
      />
    </>
  )
}
export default WritePostPage
