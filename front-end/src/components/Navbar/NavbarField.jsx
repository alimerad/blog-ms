import Link from "next/link"

const NavbarField = (props) => {
  const { children, href } = props

  return (
    <Link href={href}>
      <div
        className="lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white
        font-bold items-center justify-center hover:bg-green-600
        hover:text-white hover:cursor-pointer"
      >
        {children}
      </div>
    </Link>
  )
}
export default NavbarField
