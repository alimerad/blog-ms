import Post from "./Post"
import useApi from "src/hooks/useApi"
import ErrorBox from "@components/Misc/ErrorBox"
import { v4 as uuidv4 } from "uuid"

const SetPosts = (props) => {
  const { userId, isPublished = true, postState } = props

  // Construire l'URL en fonction de userId et isPublished
  const route =
    typeof userId === "undefined"
      ? "/posts/published"
      : `/users/${userId}/posts/${isPublished ? "published" : "drafted"}`

  // Appeler le hook inconditionnellement
  const apiResult = useApi("get", route)

  console.log(apiResult)
  // Si postState est fourni, on l'utilise ; sinon, on utilise le résultat du hook
  const [err, data] = postState ? [null, postState] : apiResult

  return err ? (
    <ErrorBox message={data} />
  ) : (
    <div className="container mx-1/2 flex flex-wrap">
      {Object.values(data).map((post) => (
        <Post key={uuidv4()} {...post} {...props} />
      ))}
    </div>
  )
}

export default SetPosts
