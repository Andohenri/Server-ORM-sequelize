const jwt = require('jsonwebtoken')

exports.authenticate = (req, res, next) => {
   try {
      const token = req.headers.cookie.split('=')[1]
      // const token = req.headers.authorization.split(' ')[1]
      const decodedToken = jwt.verify(token, 'TOKEN')
      req.user = {
         id: decodedToken.id,
         username: decodedToken.username,
         isAdmin: decodedToken.isAdmin
      }
      next()
   } catch (error) {
      res.status(401).json("User not authentified")
   }
}
exports.authorizedAsAdmin = (req, res, next) => {
   if(req.user && req.user.isAdmin){
      next()
   }else{
      res.status(401).json({message: "User not an Admin authentified!"})
   }
}