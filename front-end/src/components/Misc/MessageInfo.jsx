import { useRouter } from "next/router"

const MessageInfo = () => {
  const router = useRouter()
  const { messageInfo } = router.query

  return messageInfo ? (
    <div className="flex justify-center">
      <p className="bg-amber-400 text-white text-center font-bold px-4 py-2 mt-5 w-1/2">
        {messageInfo}
      </p>
    </div>
  ) : null
}
export default MessageInfo
