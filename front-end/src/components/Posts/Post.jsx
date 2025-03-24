import Link from "next/link"
import Image from "next/image"
import Button from "@components/Form/Button"
import { BsEyeFill } from "react-icons/bs"

const Post = (props) => {
  const { userState } = props

  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      minute: "numeric",
      hour: "numeric",
      second: "numeric",
    })
  }

  
return (
    <section className="w-1/2 flex flex-col items-center px-3">
      <article className="flex flex-col shadow my-4">
        <div className="hover:opacity-75">
          <Image src="/postPicture.jpg" width="1000" height="500" />
        </div>
        <div className="bg-white flex flex-col justify-start p-6">
          <span className="text-3xl font-bold hover:text-gray-700 pb-4 flex">
            {props.title}
          </span>
          <div className="text-sm pb-8">
            By
            <Link
              href={`/users/profil/${userState ? userState.id : props.userId}`}
              className="font-semibold hover:text-gray-800"
            >
              {` ${userState ? userState.displayName : props.author}`}
            </Link>
            , {`${props.statePost} on ${formattedDate(props.createdAt)}`}
          </div>
          <p className="pb-3">
            <Link href={`/posts/${props.id}`}>
              <a>
                <Button className="bg-sky-400 hover:bg-sky-500 active:bg-sky-600 ml-3 rounded-full">
                  <BsEyeFill />
                </Button>
              </a>
            </Link>
          </p>
        </div>
      </article>
    </section>
  )
}
export default Post
