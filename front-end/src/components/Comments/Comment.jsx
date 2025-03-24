import Link from "next/link"
import { ImCross } from "react-icons/im"
import { useState, useContext } from "react"
import RemoveCommentModal from "@components/Modal/RemoveCommentModal"
import { AppContext } from "@components/Context/AppContext"
import Image from "next/image"

const Comment = (props) => {
  const { state, setData } = props
  const [showRemoveComment, setShowRemoveComment] = useState(false)
  const { sessionUserId, sessionRightUser } = useContext(AppContext)

  const isAuthor = (commentUserId) => {
    return Number(commentUserId) === Number(sessionUserId)
  }

  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      minute: "numeric",
      hour: "numeric",
      second: "numeric",
    })
  }

  return (
    <div className="flex justify-center items-center mt-5 w-full">
      <div className="px-7 w-[700px] rounded-[12px] bg-white p-4">
        <div className="text-sm font-semibold text-blue-900 transition-all hover:text-black flex justify-between">
          <div className="flex justify-between">
            <Image
              src="/profil.png"
              width="40"
              height="40"
              className="py-100"
            />
            <Link
              href={`/users/profil/${state.userId}`}
              className="font-semibold hover:text-gray-800 cursor-pointer "
            >
              {` ${state.author}`}
            </Link>
          </div>
          <div className="flex flex-row justify-around">
            {`${formattedDate(state.postedAt)}`}
            {sessionRightUser === "admin" || isAuthor(state.userId) ? (
              <ImCross
                className="hover:cursor-pointer hover:text-red-500"
                onClick={() => {
                  setShowRemoveComment(true)
                }}
              />
            ) : null}
          </div>
        </div>
        <div>
          <p className="px-3 text-sm py-1 mt-5 outline-none border-pink-300 w-full resize-none border rounded-lg placeholder:text-sm">
            {state.content}
          </p>
        </div>
      </div>
      {showRemoveComment ? (
        <RemoveCommentModal
          toggleModal={setShowRemoveComment}
          commentInfo={state}
          setData={setData}
        />
      ) : null}
    </div>
  )
}
export default Comment
