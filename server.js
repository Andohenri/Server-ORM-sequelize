require("dotenv").config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/userRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const articleRoutes = require('./routes/articleRoutes')
const commentRoutes = require('./routes/commentRoutes')

const server = express()
const PORT = process.env.SERVER_PORT
const HOST = process.env.SERVER_HOST

//middlewares
server.use(cors())
server.use(express.json())
server.use(cookieParser())

//routes
server.use('/api/users', userRoutes)
server.use('/api/articles', articleRoutes)
server.use('/api/comment', commentRoutes)

//uploads images
server.use('/api/uploads', uploadRoutes)
//get image via URL
server.use('/images', express.static(path.join(__dirname, 'uploads')))

server.listen(PORT, HOST, () => {
   console.log(`Server en écoute: http://${HOST}:${PORT}`)
})