import Button from "@components/Form/Button"
import { useContext, useState } from "react"
import { makeClient } from "@services/makeClient.js"
import { AppContext } from "@components/Context/AppContext"
import { useRouter } from "next/router"
import ErrorBox from "@components/Misc/ErrorBox"

const RemoveUserModal = (props) => {
  const { toggleModal, userInfo } = props
  const { jwt, sessionUserId, logout } = useContext(AppContext)
  const [err, setError] = useState(null)
  const router = useRouter()

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Remove user</h3>
            </div>
            {err ? <ErrorBox message={err} /> : null}

            <div className="relative p-6 flex-auto">
              <p className="my-4 text-slate-500 text-lg leading-relaxed">
                You're about to make an irreverssible action. Do you want to
                continue ?
              </p>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <Button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  toggleModal(false)
                }}
              >
                Abort
              </Button>
              <Button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={async () => {
                  try {
                    const { data } = await makeClient({
                      headers: { authentication: jwt },
                      session: { sessionUserId },
                    }).delete(`/users/users/${userInfo.id}`)

                    if (data) {
                      logout()
                      toggleModal(false)
                      router.push({
                        pathname: "/",
                        query: {
                          messageInfo:
                            "The account has been successfully deleted",
                        },
                      })
                    }
                  } catch (err) {
                    setError(err.statusText)
                  }
                }}
              >
                Hell yeah
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}
export default RemoveUserModal
