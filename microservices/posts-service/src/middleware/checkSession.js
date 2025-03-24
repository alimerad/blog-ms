const checkSession = (req, res, next) => {
  if (req.method === "GET") {
    const {
      params: { userId },
      session: { userId: sessionUserId },
    } = req

    if (!userId || !sessionUserId) {
      res.status("401").send({ error: "An error has occured" })

      return
    }
    if (Number(userId) != sessionUserId) {
      res.status(403).send({ error: "Access Denied" })

      return
    }
  }

  next()
}
export default checkSession
