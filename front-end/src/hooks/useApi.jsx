import { AppContext } from "@components/Context/AppContext"
import { makeClient } from "@services/makeClient.js"
import { useContext, useState, useEffect } from "react"

const useApi = (method, route, args = {}) => {
  const [result, setResult] = useState([null, args])
  const { jwt, sessionUserId } = useContext(AppContext)
  const deps = JSON.stringify(route)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await makeClient({
          headers: { authentication: jwt },
          session: { sessionUserId: sessionUserId },
        })[method](route, args)

        setResult([null, data])
      } catch (err) {
        setResult([err, err.response])
      }
    })()
  }, [jwt, deps, method])

  return result
}
export default useApi
