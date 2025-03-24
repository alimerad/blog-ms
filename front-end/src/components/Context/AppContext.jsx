import { createContext, useCallback, useState } from "react"

const initialJwt =
  typeof window === "undefined" ? null : localStorage.getItem("sessionJwt")

const initialUserId =
  typeof window === "undefined" ? null : localStorage.getItem("sessionUserId")

const initialUserRight =
  typeof window === "undefined" ? null : localStorage.getItem("sessionRight")

export const AppContext = createContext(null)

export const AppContextProvider = (props) => {
  const [jwt, setJwt] = useState(initialJwt)
  const [sessionUserId, setSessionUserId] = useState(initialUserId)
  const [sessionRightUser, setSessionRightUser] = useState(initialUserRight)

  const login = useCallback(
    ({ jwt, sessionUserId, userRight: sessionRightUser }) => {
      localStorage.setItem("sessionJwt", jwt)
      localStorage.setItem("sessionUserId", sessionUserId)
      localStorage.setItem("sessionRight", sessionRightUser)

      setJwt(jwt)
      setSessionUserId(sessionUserId)
      setSessionRightUser(sessionRightUser)
    },
    [],
  )

  const logout = useCallback(() => {
    localStorage.removeItem("sessionJwt")
    localStorage.removeItem("sessionUserId")
    localStorage.removeItem("sessionRight")

    setJwt(null)
    setSessionUserId(null)
    setSessionRightUser(null)
  })

  return (
    <AppContext.Provider
      {...props}
      value={{
        login,
        logout,
        jwt,
        sessionUserId,
        sessionRightUser,
      }}
    />
  )
}
