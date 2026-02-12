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
    const user = req.signedCookies["user"]
    if (user) {
        res.redirect("/dashboard")
    } else {
        res.render("index")
    }

})

controller.get("/dashboard", (req, res) => {
    return service.dashboard(req, res)
})

controller.get("/register", (req, res) => {
    res.render("register")
})

controller.get("/login", (req, res) => {
    res.render("login")
})

controller.post("/auth/register", (req, res) => {
    return service.register(req, res)
})

controller.post("/auth/login", (req, res) => {
    return service.login(req, res)
})
