import { useState, useEffect, useContext } from "react"
import { MdAccountCircle } from "react-icons/md"
import NavbarField from "./NavbarField.jsx"
import { AppContext } from "@components/Context/AppContext.jsx"
import { MdOutlineMessage } from "react-icons/md"
import { MdAdminPanelSettings } from "react-icons/md"

const Navbar = () => {
  const { sessionUserId, sessionRightUser } = useContext(AppContext)
  const [mounted, setMounted] = useState(false)

  // Dès que le composant est monté côté client, on met à jour l'état
  useEffect(() => {
    setMounted(true)
  }, [])

  // Pendant le SSR, on rend une structure minimale identique à celle côté client
  // Cela évite le mismatch lors de l'hydratation.
  return (
    <nav className="flex items-center flex-wrap bg-stone-700 p-3">
      <NavbarField href="/">
        <div className="text-xl text-white font-bold uppercase tracking-wide">
          Groundblog
        </div>
      </NavbarField>
      <div className="w-full lg:inline-flex lg:flex-grow lg:w-auto">
        <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-center flex flex-col lg:h-auto">
          {/* On affiche les éléments conditionnels uniquement si le composant est monté */}
          {mounted && sessionRightUser && sessionRightUser !== "reader" ? (
            <NavbarField href="/posts/write">
              <MdOutlineMessage size={16} />
            </NavbarField>
          ) : null}
          {mounted && sessionRightUser && sessionRightUser === "admin" ? (
            <NavbarField href="/admin/panel">
              <MdAdminPanelSettings size={16} />
            </NavbarField>
          ) : null}
          <NavbarField
            href={
              !sessionUserId
                ? "/users/authentication/sign-in"
                : `/users/profil/${sessionUserId}`
            }
          >
            <MdAccountCircle size={32} />
          </NavbarField>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
