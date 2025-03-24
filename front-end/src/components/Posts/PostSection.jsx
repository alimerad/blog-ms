import CommentSection from "@components/Comments/CommentSection"
import Article from "./Article"

const PostSection = (props) => {
  return (
    <section className="w-full md:w-2/3 flex flex-col items-center px-3">
      <Article {...props} />
      <CommentSection {...props} />
    </section>
  )
}
export default PostSection
