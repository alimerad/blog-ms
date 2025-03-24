import Button from "@components/Form/Button.jsx"
import FormField from "@components/Form/FormField.jsx"
import { makeClient } from "@services/makeClient.js"
import { useCallback } from "react"
import { Formik } from "formik"
import * as yup from "yup"
import { useContext, useState } from "react"
import { AppContext } from "@components/Context/AppContext"
import ErrorBox from "@components/Misc/ErrorBox"
import { router } from "next/router"

const initialValues = {
  title: "",
  description: "",
  isPublished: false,
}

const validationSchema = yup.object().shape({
  title: yup.string().required().label("Title"),
  description: yup.string().required().label("Description content"),
})

const WritePost = (props) => {
  const { jwt, sessionUserId, sessionRightUser } = useContext(AppContext)
  const [error, setError] = useState(null)
  const { postState, setPostState } = props

  const handleFormSubmit = useCallback(
    async ({ title, description, isPublished }, { resetForm }) => {
      setError(null)

      try {
        const { data } = await makeClient({
          headers: { authentication: jwt },
          session: { sessionUserId },
        }).post("posts//posts", {
          title,
          description,
          userId: sessionUserId,
          statePostId: isPublished ? 1 : 2,
        })

        if (isPublished) {
          router.push({
            pathname: `/posts/${data.id}`,
            query: { messageInfo: "Post successfully created" },
          })
        } else {
          setPostState([data, ...postState])
          resetForm()
        }
      } catch (err) {
        const { response: { data } = {} } = err
        setError(data)
      }
    },
    [],
  )

  return !sessionRightUser || sessionRightUser === "reader" ? null : (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({ handleSubmit, isValid, isSubmitting }) => (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="shadow-md rounded p-10 mb-4  justify-items-center items-center w-full"
        >
          {error ? <ErrorBox message={error} /> : null}
          <FormField
            name="title"
            label="Title *"
            type="text"
            placeholder="Enter a title for your post"
          />

          <FormField
            name="description"
            label="Description content *"
            as="textarea"
            rows="5"
            className="form-control resize-none bg-gray-200 shadow-inner rounded-l p-2 flex-1 w-full"
            placeholder="Enter any content"
          />
          <FormField
            name="isPublished"
            label="Publish"
            type="checkbox"
            className="form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
          />
          <div className="flex justify-center">
            <Button
              className="bg-blue-600 hover:bg-blue-700 w-1/2 mt-5 active:bg-blue-500"
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Send post
            </Button>
          </div>
        </form>
      )}
    </Formik>
  )
}
export default WritePost
