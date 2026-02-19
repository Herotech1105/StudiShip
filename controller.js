// Using Express for http mappings
const express = require("express")
const controller = express()

// Cookie-Parser primarily for singed login cookie
const cookieParser = require("cookie-parser")
controller.use(cookieParser("securityToken"))

// Specifies that the controller loads .hbs files as resources from the views folder
controller.set("view engine", 'hbs')

// Specifies public directory for HTML, CSS and JS files the client can request
const path = require("path")
const publicDir = path.join(__dirname, './public')
controller.use(express.static(publicDir))

controller.use(express.urlencoded({extended: false}))
controller.use(express.json())

// creates server from controller
const http = require('http')
const server = http.createServer(controller)

// adds socket.io websocket support to server and adds cookie parser
const {Server} = require('socket.io')
const websocket = new Server(server)
const websocketCookieParser = require('socket.io-cookie-parser')
websocket.use(websocketCookieParser("securityToken"))

// imports service layer to handle request/response logic
require("./model/service")().then((service) => {

    // websocket and broadcasting to handle messages
    websocket.on('connection', (socket) => {

        socket.on('room', (room) => {
            socket.join(room)
        })

        socket.on('message', (message) => {
            const messageObject = JSON.parse(message)
            messageObject.timestamp = new Date()
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ') // From https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
            messageObject.user = socket.request.signedCookies['user']
            service.saveMessage(messageObject)
            websocket.to(messageObject.roomId).emit("message", JSON.stringify(messageObject))
        })
    })

    server.listen(5000, () => {
        console.log("Server started on port 5000")
    })

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
        service.roomAdder(req, res)
    })

    controller.get("/search", (req, res) => {
        service.search(req, res)
    })

    controller.post("/rooms/create", (req, res) => {
        service.createRoom(req, res)
    })

    controller.post("/logout", (req, res) => {
        service.logout(req, res)
    })

    controller.post("/auth/register", (req, res) => {
        return service.register(req, res)
    })

    controller.post("/auth/login", (req, res) => {
        return service.login(req, res)
    })

    controller.post("/search", (req, res) => {
        service.findRooms(req, res)
    })
})