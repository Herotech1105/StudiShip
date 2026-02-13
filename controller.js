const express = require("express")

const controller = express()

const cookieParser = require("cookie-parser")
controller.use(cookieParser("secret"))

controller.set("view engine", 'hbs')

const path = require("path")
const publicDir = path.join(__dirname, './public')
controller.use(express.static(publicDir))

controller.use(express.urlencoded({extended: false}))
controller.use(express.json())

controller.listen(5000, () => {
    console.log("server started on port 5000")
})

const Service = require("./model/service")
const service = new Service()

controller.get("/", (req, res) => {
    service.frontPage(req, res)
})

controller.get("/rooms", (req, res) => {
    return service.room(req, res)
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
