import { IoIosRemoveCircle } from "react-icons/io"
import Link from "next/link"
import Image from "next/image"
import { BiEditAlt } from "react-icons/bi"
import Button from "@components/Form/Button"
import { AppContext } from "@components/Context/AppContext"
import { useContext, useState } from "react"
import EditPostModal from "@components/Modal/EditPostModal"
import RemovePostModal from "@components/Modal/RemovePostModal"
import { MdPublishedWithChanges } from "react-icons/md"
import { makeClient } from "@services/makeClient"

const Article = (props) => {
  const { state, setState } = props
  const { sessionUserId, sessionRightUser, jwt } = useContext(AppContext)
  const [showEditPost, setShowEditPost] = useState(false)
  const [showRemovePost, setShowRemovePost] = useState(false)

  const isAuthor = (userId) => {
    return Number(userId) === Number(sessionUserId)
  }

  return (
    <article className="flex flex-col shadow my-4">
      <div className="hover:opacity-75">
        <Image src="/postPicture.jpg" width="1000" height="500" />
      </div>
      <div className="bg-white flex flex-col justify-start p-6">
        <div className="text-3xl font-bold hover:text-gray-700 pb-4 flex">
          {state.title}
          {isAuthor(state.userId) || sessionRightUser === "admin" ? (
            <div>
              <Button
                className="bg-green-400 hover:bg-green-500 active:bg-green-600 ml-3 rounded-full"
                onClick={() => {
                  setShowEditPost(true)
                }}
              >
                <BiEditAlt size={20} />
              </Button>
              <Button
                className="bg-red-400 hover:bg-red-500 active:bg-red-600 ml-3 rounded-full"
                onClick={() => {
                  setShowRemovePost(true)
                }}
              >
                <IoIosRemoveCircle size={20} />
              </Button>
              {state.statePost !== "drafted" ? null : (
                <Button
                  className="bg-sky-400 hover:bg-sky-500 active:bg-sky-600 ml-3 rounded-full"
                  onClick={async () => {
                    const { data } = await makeClient({
                      headers: { authentication: jwt },
                      session: { userId: sessionUserId },
                    }).put(`/posts/posts/${state.id}`, {
                      statePostId: 1,
                      createdAt: Date.now(),
                    })
                    setState(data)
                  }}
                >
                  <MdPublishedWithChanges size={20} />
                </Button>
              )}
            </div>
          ) : null}
        </div>
        <p className="text-sm pb-8">
          By
          <Link
            href={`/users/profil/${state.userId}`}
            className="font-semibold hover:text-gray-800"
          >
            {` ${state.author}`}
          </Link>
          , {`${state.statePost} on ${Date(state.createdAt)}`}
        </p>
        <p className="pb-3">{state.description}</p>
      </div>
      {showEditPost ? (
        <EditPostModal
          toggleModal={setShowEditPost}
          postInfo={state}
          setData={setState}
        />
      ) : null}
      {showRemovePost ? (
        <RemovePostModal
          toggleModal={setShowRemovePost}
          postInfo={state}
          setData={setState}
        />
      ) : null}
    </article>
  )
}
export default Article
