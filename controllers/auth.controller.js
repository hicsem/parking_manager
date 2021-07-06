const { User } = require("../models")
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")

const signin = async (req, res) => {
  try {
    let user = await User.findOne({ where: { email: req.body.email } })
    if (!user) return res.status("401").json({ error: "User not found" })
    const isValidPassword = await user.validPassword(
      req.body.password,
      user.dataValues.hashedPassword
    )
    if (!isValidPassword) {
      return res.status("401").send({ error: "Email or password don't match." })
    }

    const token = jwt.sign(
      { id: user.dataValues.id, admin: user.dataValues.admin },
      process.env.JWT_SECRET
    )

    res.cookie("t", token, { expire: new Date() + 9999 })

    return res.json({
      token,
      user: {
        id: user.dataValues.id,
        name: user.dataValues.name,
        email: user.dataValues.email,
      },
    })
  } catch (err) {
    return res.status("401").json({ error: "Could not sign in" })
  }
}

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status("200").json({
    message: "signed out",
  })
}

const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
})

const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile.dataValues.id == req.auth.id
  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized",
    })
  }
  next()
}

const hasAdminRights = (req, res, next) => {
  const authorized = req.auth && req.auth.admin

  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized",
    })
  }
  next()
}

module.exports = {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  hasAdminRights,
}
