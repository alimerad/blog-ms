import classnames from "classnames"

const className = "text-white shadow p-2 text-center"

const Button = (props) => {
  const { ...otherProps } = props

  
return (
    <button
      {...otherProps}
      className={classnames(className, props.className)}
    />
  )
}

export default Button
