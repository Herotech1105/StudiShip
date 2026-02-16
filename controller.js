// Using Express for http mappings
const express = require("express")
const controller = express()

// Cookie-Parser primarily for singed login cookie
const cookieParser = require("cookie-parser")
controller.use(cookieParser("securityToken"))

// Specifies that the controller loads .hbs files as resources from the views folder
controller.set("view engine", 'hbs')

// Specifies public directory for html, css and js files the client can request
const path = require("path")
const publicDir = path.join(__dirname, './public')
controller.use(express.static(publicDir))

controller.use(express.urlencoded({extended: false}))
controller.use(express.json())

// creates server from controller
const http = require('http')
const server = http.createServer(controller)

// adds socket.io websocket support to server
const {Server} = require('socket.io')
const websocket = new Server(server)

websocket.on('connection', (socket) => {
    console.log('Socket connected')

    socket.on('room', (room) => {
        socket.join(room)
        console.log('Room joined', room)
    })

    socket.on('message', (message) => {
        const messageObject = JSON.parse(message)
        messageObject.timestamp = new Date()
        messageObject.user = "User"
        websocket.to(messageObject.roomId).emit("message", JSON.stringify(messageObject))
    })
})

server.listen(5000, () => {
    console.log("Server started on port 5000")
})

// imports service layer to handle request/response logic
const Service = require("./model/service")
const service = new Service()


// controller mappings on which the server responds
controller.get("/", (req, res) => {
    service.frontPage(req, res)
})

controller.get("/rooms", (req, res) => {
    service.room(req, res)
})

controller.get("/register", (req, res) => {
    res.render("register")
})

controller.get("/login", (req, res) => {
    res.render("login")
})

controller.get("/rooms/create", (req, res) => {
    res.render("roomAdder")
})

controller.post("/rooms/create", (req, res) => {
    service.createRoom(req, res)
})

controller.post("/auth/register", (req, res) => {
    return service.register(req, res)
})

controller.post("/auth/login", (req, res) => {
    return service.login(req, res)
})
