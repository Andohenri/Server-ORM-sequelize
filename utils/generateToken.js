const jwt = require('jsonwebtoken')

exports.generateToken = (res, {id, username, isAdmin}) => {
   const token = jwt.sign({ id, username, isAdmin }, 'TOKEN', { expiresIn: '24h'})
   res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30*24*60*60*1000
   })
   return token
}