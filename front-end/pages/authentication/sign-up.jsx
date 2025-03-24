import { Formik } from "formik"
import * as yup from "yup"
import { useCallback, useContext, useState } from "react"
import Button from "@components/Form/Button.jsx"
import FormField from "@components/Form/FormField.jsx"
import { makeClient } from "@services/makeClient.js"
import { AppContext } from "@components/Context/AppContext"
import { useRouter } from "next/router"

const initialValues = {
  email: "",
  password: "",
  passwordConfirmation: "",
  displayName: "",
}

const validationSchema = yup.object().shape({
  email: yup.string().email().required().label("Email"),
  displayName: yup.string().required().label("Display name"),
  password: yup.string().min(8).required().label("Password"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords mismatching"),
})

const SignUpForm = () => {
  const [error, setError] = useState(null)
  const { login } = useContext(AppContext)
  const router = useRouter()

  const checkReturnedErrorMessage = (valueToCheck) => {
    if (valueToCheck.match(/email/)) {
      return "Email not available."
    }

    if (valueToCheck.match(/displayName/)) {
      return "Display name not available."
    }
  }

  const handleFormSubmit = useCallback(
    async ({ email, displayName, password }) => {
      setError(null)

      try {
        const { data } = await makeClient().post("/users/sign-up", {
          email,
          displayName,
          password,
        })

        login(data)
        router.push("/")
      } catch (err) {
        const { response: { data } = {} } = err

        if (data.message) {
          setError(checkReturnedErrorMessage(data.message.nativeError.detail))

          return
        }

        setError("We're sorry, an error has occured.")
      }
    },
    [],
  )

  return (
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
            <p className="bg-red-600 text-white font-bold px-4 py-2">{error}</p>
          ) : null}
          <FormField
            name="email"
            label="E-mail *"
            type="text"
            placeholder="Enter your email"
          />
          <FormField
            name="displayName"
            label="Display name *"
            type="text"
            placeholder="Enter a displayName"
          />
          <FormField
            name="password"
            label="Password *"
            type="password"
            placeholder="Enter your password"
          />
          <FormField
            name="passwordConfirmation"
            label="Password confirmation *"
            type="password"
            placeholder="Enter your password"
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-500"
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            Sign up
          </Button>
        </form>
      )}
    </Formik>
  )
}
export default SignUpForm
