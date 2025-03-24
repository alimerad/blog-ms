import { BiLogOut } from "react-icons/bi"
import { useContext, useState } from "react"
import { AppContext } from "@components/Context/AppContext"
import { useRouter } from "next/router"
import EditProfilPage from "@components/Modal/EditProfilModal"
import AuthorApplicationModal from "@components/Modal/AuthorApplicationModal"

const UserActions = (props) => {
  const router = useRouter()
  const { userState } = props
  const { sessionUserId, logout } = useContext(AppContext)
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [showModalAuthorApplication, setShowModalAuthorApplication] =
    useState(false)

  const isOwnerProfile = () => {
    return Number(userState.id) === Number(sessionUserId)
  }

  const onLogout = () => {
    logout()
    router.push({
      pathname: "/",
      query: { messageInfo: "You're now disconnected" },
    })
  }

  return (
    <div>
      <ul className="sm:w-full lg:mt-2 text-center text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:border-gray-600 dark:text-black">
        {!isOwnerProfile() ? null : (
          <li className="w-full px-4 py-2 border-b border-sky-200 dark:border-gray-600 hover:text-gray-500">
            <span
              className="hover:cursor-pointer hover:text-gray-900"
              onClick={() => {
                setShowModalEdit(true)
              }}
            >
              Edit Profil
            </span>
          </li>
        )}
        {isOwnerProfile() && userState.right === "reader" ? (
          <li
            className="w-full px-4 py-2 border-b border-sky-200 dark:border-gray-600 hover:text-gray-500 hover:cursor-pointer"
            onClick={() => {
              setShowModalAuthorApplication(true)
            }}
          >
            Want to be an author ?
          </li>
        ) : null}
        {!isOwnerProfile() ? null : (
          <li className="w-full px-4 py-2 rounded-b-lg flex justify-around">
            <span
              className="hover:text-red-700 active:text-red-800 hover:cursor-pointer"
              onClick={onLogout}
            >
              <BiLogOut size={25} />
            </span>
          </li>
        )}
      </ul>
      {showModalAuthorApplication ? (
        <AuthorApplicationModal
          {...props}
          toggleModal={setShowModalAuthorApplication}
        />
      ) : null}
      {showModalEdit ? (
        <EditProfilPage {...props} toggleModal={setShowModalEdit} />
      ) : null}
    </div>
  )
}
export default UserActions
