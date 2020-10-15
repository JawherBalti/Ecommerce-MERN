const jwt = require('jsonwebtoken')

module.exports = function (req, res, next){
  const token = req.header("w_auth")
  if(!token){
    return res.status(401).json({
      msg: "No token, auth failed"
    })
  }
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)
    req.user = decoded.user
    next()
  } catch(error) {
    res.status(401).json({
      msg: "Token not valid"
    })
  }
}