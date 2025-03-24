import useApi from "src/hooks/useApi"
import { AiFillCheckCircle } from "react-icons/ai"
import { ImCross } from "react-icons/im"
import Link from "next/link"
import { makeClient } from "@services/makeClient"
import { AppContext } from "@components/Context/AppContext"
import { useState, useContext, useEffect } from "react"
import Router from "next/router"
import ErrorBox from "@components/Misc/ErrorBox"

const AdminPanel = () => {
  const [err, data] = useApi("get", "/applications")
  const [applicationState, setApplicationState] = useState(data)
  const { jwt, sessionRightUser } = useContext(AppContext)

  // Redirige si l'utilisateur n'est pas admin, sinon met à jour l'état avec les données
  useEffect(() => {
    if (!sessionRightUser || sessionRightUser !== "admin") {
      Router.push("/")
    } else {
      setApplicationState(data)
    }
  }, [sessionRightUser, data])

  // Met à jour l'état des applications dès que data change
  useEffect(() => {
    setApplicationState(data)
  }, [data])

  const sendApplication = async (validated, applicationId) => {
    try {
      const { data } = await makeClient({
        headers: { authentication: jwt },
      }).post("/applications/manage", {
        validatedApplication: validated,
        applicationId,
      })

      if (data) {
        setApplicationState(data)
      }
    } catch (err) {
      return err
    }
  }

  return err ? (
    <ErrorBox message={data.message} />
  ) : (
    <div className="flex flex-col">
      {!applicationState.length ? (
        <ErrorBox message="Any author application found for now... Come back later" />
      ) : (
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <h2 className="text-3xl font-semibold text-center mt-5 leading-normal mt-0 mb-2 text-black-800">
            Pending Author Application
          </h2>
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-white border-b">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Application date
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(applicationState).map((application) => (
                    <tr
                      key={application.id}
                      className="bg-gray-100 border-b justify-start"
                    >
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        <span>
                          <Link href={`/users/profil/${application.userId}`}>
                            {application.author}
                          </Link>
                        </span>
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {application.applicationDate}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap flex justify-around w-1/2">
                        <ImCross
                          size={20}
                          className="text-red-500 hover:text-red-600 active:text-red-700"
                          onClick={() => {
                            sendApplication(false, application.id)
                          }}
                        />
                        <AiFillCheckCircle
                          size={20}
                          className="text-green-500 hover:text-green-600 active:text-green-700"
                          onClick={() => {
                            sendApplication(true, application.id)
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
