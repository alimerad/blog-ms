import Button from "@components/Form/Button"
import { Formik } from "formik"
import * as yup from "yup"
import { useCallback, useContext, useState } from "react"
import FormField from "@components/Form/FormField.jsx"
import { makeClient } from "@services/makeClient.js"
import { AppContext } from "@components/Context/AppContext"

const initialValues = {
  title: "",
  description: "",
}

const validationSchema = yup.object().shape({
  title: yup.string().label("Title"),
  description: yup.string().label("Description"),
})

const EditPostModal = (props) => {
  const { toggleModal, postInfo, setData } = props
  const [error, setError] = useState(null)
  const { jwt, sessionUserId } = useContext(AppContext)

  const handleFormSubmit = useCallback(async ({ title, description }) => {
    setError(null)

    try {
      const { data } = await makeClient({
        headers: { authentication: jwt },
        session: { userId: sessionUserId },
      }).put(`/posts/posts/${postInfo.id}`, {
        title,
        description,
        userId: postInfo.userId,
      })

      if (data) {
        const { data } = await makeClient().get(`/posts/post/${postInfo.id}`)
        setData(data)
        toggleModal(false)
      }
    } catch (err) {
      const { response: { data } = {} } = err

      if (data) {
        setError(data.message)

        return
      }

      setError("We're sorry, an error has occured.")
    }
  }, [])

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">Edit post</h3>
            </div>
            <div className="relative p-6 flex-auto">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ handleSubmit, isValid, isSubmitting }) => (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="shadow-md rounded p-10 mb-4 grid justify-items-center items-center w-full"
                  >
                    {error ? (
                      <p className="bg-red-600 text-white font-bold px-4 py-2">
                        {error}
                      </p>
                    ) : null}
                    <FormField
                      name="title"
                      label="Title *"
                      type="text"
                      placeholder="Update the title ?"
                    />
                    <FormField
                      name="description"
                      label="Description content *"
                      as="textarea"
                      rows="5"
                      className="form-control resize-none bg-gray-200 shadow-inner rounded-l p-2 flex-1 w-full"
                      placeholder="Enter any content"
                    />
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 active:bg-blue-500 mt-5"
                      type="submit"
                      disabled={!isValid || isSubmitting}
                    >
                      Update
                    </Button>
                  </form>
                )}
              </Formik>
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
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}
export default EditPostModal
