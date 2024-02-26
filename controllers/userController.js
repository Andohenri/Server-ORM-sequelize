const bcrypt = require('bcrypt/bcrypt')
const model = require('../models')
const fs = require('fs')
const { generateToken } = require('../utils/generateToken')

exports.register = async (req, res) => {
   const { username, email, password } = req.body
   if(!username) return res.status(409).json({ message: "Username required." })
   if(!email) return res.status(409).json({ message: "Email required." })
   if(!password) return res.status(409).json({ message: "Password required." })

   // Check if user already exists
   const existingUser = await model.User.findOne({ where: {email} })
   if(existingUser) return res.status(400).json({ message: "User already exist." })

   // Hash the passwowrd
   const hashedPassword = await bcrypt.hash(password, 10)

   // Check the image if define
   const image = req.file 
      ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
      : `${req.protocol}://${req.get('host')}/images/default.jpg`

   // create the user
   try {
      const user = await model.User.create({username, imageProfile: image, email, password: hashedPassword, isAdmin: false})
      return res.status(201).json({
         id: user.id,
         username: user.username,
         imageProfile: user.imageProfile,
         email: user.email,
         isAdmin: user.isAdmin,
      })
   } catch (error) {
      return res.status(500).json({message: "Failed to create user."})
   }
}
exports.login = async (req, res) => {
   const { email, password } = req.body
   try {
      // Check if user already exists
      const user = await model.User.findOne({ where: {email} })
      if(!user) return res.status(404).json({ message: "User not found." })
      
      // compare password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if(!isPasswordValid) return res.status(401).json({ message: "Invalid credentials"})
      
      // generate token
      generateToken(res, user)
      return res.status(200).json({
         username: user.username,
         imageProfile: user.imageProfile,
         email: user.email,
         isAdmin: user.isAdmin
      })
   } catch (error) {
      return res.status(500).json({message: "Internal server error"})
   }
}
exports.getAllUsers = async (req, res) => {
   try {
      const users = await model.User.findAll({
         attributes: { exclude: ['password'] }
      })
      if(!users) return res.status(400).json({ message: "No such users." })
      return res.status(200).json(users)
   } catch (error) {
      return res.status(500).json({ message: "Failed to get all users." })
   }
}
exports.getCurrentUserProfile = async (req, res) => {
   try {
      const user = await model.User.findByPk(req.user.id, {
         attributes: { exclude: ['password'] }
      })
      if(!user) return res.status(404).json({ message: "User not found" })
      return res.status(200).json(user)
   } catch (error) {
      return res.status(500).json({ message: "Internal server error" })
   }
}
exports.updateCurrentUserProfile = async (req, res) => {
   const { username, email, password } = req.body
   try {
      const user = await model.User.findByPk(req.user.id)
      if(!user) return res.status(404).json({ message: "User not found" })
      
      //Check if password exist in the body request
      let hashedPassword
      if(password) {
         hashedPassword = await bcrypt.hash(password, 10)
      }
      if(req.file){
         const filename = user.imageProfile.split('/images/')[1]
         if(filename !== 'default.jpg'){
            fs.unlink(`uploads/${filename}`, (err) => {
                  if(err) throw err
            })
         }
      }
      user.username = username || user.username
      user.imageProfile = req.file
                           ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
                           : user.imageProfile
      user.email = email || user.email
      user.password = hashedPassword || user.password


      await user.save()
      return res.status(200).json(user)
   } catch (error) {
      return res.status(500).json({ message: "Failed to update profile" })
   }
}
exports.getUser = async (req, res) => {
   const { id } = req.params
   try {
      const user = await model.User.findByPk(id, {
         attributes: { exclude: ['password'] }
      })
      if(!user) return res.status(404).json({ message: "User not found" })
      return res.status(200).json(user)
   } catch (error) {
      return res.status(500).json({ message: "Internal server error" })
   }
}
exports.updateUser = async (req, res) => {
   const { id } = req.params
   const { username, email } = req.body
   try {
      const user = await model.User.findByPk(id, {
         attributes: { exclude: ['password'] }
      })
      if(!user) return res.status(404).json({ message: "User not found" })
      
      // delete the imageProfile preceding
      if(req.file){
         const filename = user.imageProfile.split('/images/')[1]
         if(filename !== 'default.jpg'){
            fs.unlink(`uploads/${filename}`, (err) => {
                  if(err) throw err
            })
         }
      }
      user.username = username || user.username
      user.imageProfile = req.file
         ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
         : user.imageProfile
      user.email = email || user.email

      //update user
      await user.save()
      return res.status(200).json(user)
   } catch (error) {
      return res.status(500).json({ message: "Failed to update profile" })
   }
}
exports.deleteUser = async (req, res) => {
   const { id } = req.params
   try {
      const user = await model.User.findByPk(id, {
         attributes: { exclude: ['password'] }
      })
      if(!user) return res.status(404).json({ message: "User not found" })
      await user.destroy()
      const filename = user.imageProfile.split('/images/')[1]
      if(filename !== 'default.jpg'){
         fs.unlink(`uploads/${filename}`, (err) => {
               if(err) throw err
         })
      }
      return res.status(200).json(user)
   } catch (error) {
      return res.status(500).json({ message: "Failed to delete user" })
   }  
}