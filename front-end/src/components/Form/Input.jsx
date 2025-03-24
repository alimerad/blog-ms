import classnames from "classnames"

const Input = (props) => (
  <input
    {...props}
    className={classnames(
      "bg-gray-200 shadow-inner rounded-l p-2 flex-1",
      props.className,
    )}
  />
)

export default Input
