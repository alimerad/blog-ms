const ErrorBox = (props) => {
  return (
    <div className="flex justify-center">
      <p className="bg-red-600 text-white text-center font-bold px-4 py-2 mt-5 w-1/2">
        {props.message}
      </p>
    </div>
  )
}
export default ErrorBox
