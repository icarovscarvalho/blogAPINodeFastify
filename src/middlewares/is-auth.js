export function isAuth(req, rep, done) {
  const { authorization } = req.headers

  if (authorization !== 'token') {
    rep.status(403).send({
      message: "Unauthorized"
    })
  }

  done()
}