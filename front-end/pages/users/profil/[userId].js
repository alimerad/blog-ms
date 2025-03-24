import { useState, useEffect } from "react"
import UserProfile from "@components/Profile/UserProfile"
import { makeClient } from "@services/makeClient"

export const getServerSideProps = async (context) => {
  const { params } = context
  const { userId } = params

  const { data } = await makeClient().get(`/users/users/${userId}`)

  return {
    props: { user: data },
  }
}

const ProfilPage = ({ user }) => {
  const [state, setState] = useState(user)

  useEffect(() => {
    setState(user)
  }, [user])

  return <UserProfile userState={state} setUserState={setState} />
}
export default ProfilPage
