import UserInfo from "@components/Profile/UserInfo"
import UserActions from "@components/Profile/UserActions"
import { useContext } from "react"

import { AppContext } from "@components/Context/AppContext"
import UserActivity from "./UserActivity"

const UserProfile = (props) => {
  const { userState } = props

  const { sessionUserId } = useContext(AppContext)

  const isOwnerProfile = () => {
    return Number(sessionUserId) === Number(sessionUserId)
  }

  
return (
    <div className="flex-col">
      <div className="flex justify-center">
        <div className="mt-2 w-1/2 ">
          <div className="lg:flex md:grid justify-around border-solid border-2 border-sky-500">
            <UserInfo {...props} />
            {isOwnerProfile() ? <UserActions {...props} /> : null}
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-wrap py-6">
        <UserActivity {...props} userId={userState.id} />
      </div>
    </div>
  )
}
export default UserProfile
