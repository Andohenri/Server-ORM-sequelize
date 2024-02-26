require("dotenv").config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/userRoutes')
const uploadRoutes = require('./routes/uploadRoutes')

const server = express()
const PORT = process.env.SERVER_PORT
const HOST = process.env.SERVER_HOST

server.use(cors())
server.use(express.json())
server.use(cookieParser())

server.use('/api/users', userRoutes)
server.use('/api/uploads', uploadRoutes)
server.use('/images', express.static(path.join(__dirname, 'uploads')))

server.listen(PORT, HOST, () => {
   console.log(`Server en écoute: http://${HOST}:${PORT}`)
})