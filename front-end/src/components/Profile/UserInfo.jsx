import Image from "next/image"
import Button from "@components/Form/Button"
import { useContext, useState } from "react"
import { AppContext } from "@components/Context/AppContext"
import { MdDelete } from "react-icons/md"
import { HiOutlineBan } from "react-icons/hi"
import RemoveUserModal from "@components/Modal/RemoveUserModal"
import BanUserModal from "@components/Modal/BanUserModal"

const UserInfo = (props) => {
  const { userState } = props
  const { sessionUserId, sessionRightUser } = useContext(AppContext)
  const [showRemoveUser, setShowRemoveUser] = useState(false)
  const [showBanUser, setShowBanUser] = useState(false)

  const isOwnerProfile = () => {
    return Number(userState.id) === Number(sessionUserId)
  }

  return (
    <div>
      <div className="text-center">
        <Image src="/profil.png" width="100" height="100" />
      </div>
      <h5 className="mb-2 text-center">
        {`${userState.displayName} ${
          isOwnerProfile() ? `(${userState.email})` : ""
        }`}
        {!isOwnerProfile() && sessionRightUser === "admin" ? (
          <div>
            <Button
              className="bg-red-400 hover:bg-red-500 active:bg-red-600 ml-3 rounded-full"
              onClick={() => setShowRemoveUser(true)}
            >
              <MdDelete />
            </Button>
            <Button
              className="bg-red-400 hover:bg-red-500 active:bg-red-600 ml-3 rounded-full"
              onClick={() => setShowBanUser(true)}
            >
              <HiOutlineBan />
            </Button>
          </div>
        ) : null}
      </h5>
      <div className="text-center mb-2">
        <span className="bg-sky-400 p-1 px-4 rounded text-white">
          {userState.right}
        </span>
      </div>
      {showRemoveUser ? (
        <RemoveUserModal {...props} toggleModal={setShowRemoveUser} />
      ) : null}
      {showBanUser ? (
        <BanUserModal {...props} toggleModal={setShowBanUser} />
      ) : null}
    </div>
  )
}
export default UserInfo
