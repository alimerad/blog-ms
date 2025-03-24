import { AppContextProvider } from "@components/Context/AppContext"
import Navbar from "@components/Navbar/Navbar"
import MessageInfo from "@components/Misc/MessageInfo"
import "../styles/globals.css"
import Head from "next/head"

const App = ({ Component, pageProps, ...otherProps }) => {
  return (
    <AppContextProvider>
      <Head>
        <title>Groundblog</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <MessageInfo />
      <Component {...pageProps} {...otherProps} />
    </AppContextProvider>
  )
}

export default App
