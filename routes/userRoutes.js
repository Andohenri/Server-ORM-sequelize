const express = require('express')
const multer = require('../middlewares/multer')
const { login, register, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile, getUser, updateUser, deleteUser } = require('../controllers/userController')

const router = express.Router()
const { authenticate, authorizedAsAdmin } = require('../middlewares/auth')

router.post('/register', multer.single('imageProfile'), register)
router.post('/login', login)

router.route('/')
   .get(authenticate, authorizedAsAdmin, getAllUsers)

router.route('/me')
   .get(authenticate, getCurrentUserProfile)
   .put(authenticate, multer.single('imageProfile'), updateCurrentUserProfile)

router.route('/:id')
   .get(authenticate, authorizedAsAdmin, getUser)
   .put(authenticate, authorizedAsAdmin, multer.single('imageProfile'), updateUser)
   .delete(authenticate, authorizedAsAdmin, deleteUser)
module.exports = router