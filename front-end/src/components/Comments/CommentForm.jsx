import { Formik } from "formik"
import * as yup from "yup"
import { useCallback, useContext, useState } from "react"
import Button from "@components/Form/Button.jsx"
import FormField from "@components/Form/FormField.jsx"
import { makeClient } from "@services/makeClient.js"
import { AppContext } from "@components/Context/AppContext"
import Link from "next/link"

const initialValues = {
  content: "",
}

const validationSchema = yup.object().shape({
  content: yup.string().required().label("Comment"),
})

const CommentForm = (props) => {
  const [error, setError] = useState(null)
  const { jwt, sessionUserId } = useContext(AppContext)
  const { postState, setCommentState } = props

  const handleFormSubmit = useCallback(async ({ content }, { resetForm }) => {
    setError(null)

    try {
      const { data } = await makeClient({
        headers: { authentication: jwt },
        session: { userId: sessionUserId },
      }).post(`/comments`, {
        content,
        userId: sessionUserId,
        postId: postState.id,
      })

      if (data) {
        const { data } = await makeClient().get(
          `/posts/posts/${postState.id}/comments`,
        )
        setCommentState(data)
      }
    } catch (err) {
      const { response: { data } = {} } = err

      setError(data)
    }

    resetForm()
  }, [])

  return !jwt ? (
    <div className="flex justify-center items-center mt-5 w-full">
      <div className="px-7 w-[700px] rounded-[12px] bg-white p-4">
        <p className="px-3 text-center text-sm py-1 mt-5 outline-none border-pink-300 w-full resize-none border rounded-lg placeholder:text-sm">
          <span className="text-sky-500 underline ">
            <Link href={"/users/authentication/sign-in"}>Sign-in</Link>
          </span>
          <span> to leave your comment</span>
        </p>
      </div>
    </div>
  ) : (
    <div className="shadow-md w-full flex flex-col items-center px-3">
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, isValid, isSubmitting }) => (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="shadow-md rounded p-10 w-full p-4"
          >
            {error ? (
              <p className="bg-red-600 text-white font-bold px-4 py-2">
                {error.message}
              </p>
            ) : null}
            <FormField
              name="content"
              as="textarea"
              rows="5"
              className="form-control resize-none bg-gray-200 shadow-inner rounded-l p-2 flex w-full"
              placeholder="Something to say ?"
            />
            <div className="flex justify-center">
              <Button
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-500 mt-5 w-1/2"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Comment
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}
export default CommentForm
