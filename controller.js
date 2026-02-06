const express = require("express")

const controller = express()

const cookieParser = require("cookie-parser")
controller.use(cookieParser())

controller.set("view engine", 'hbs')

const path = require("path")
const publicDir = path.join(__dirname, './public')
controller.use(express.static(publicDir))

controller.use(express.urlencoded({extended: false}))
controller.use(express.json())

controller.listen(5000, () => {
    console.log("server started on port 5000")
})



controller.get("/", (req, res) => {
    const user = req.cookies["user"]
    if (user) {
        res.render("index", {
            user: user
        })
    } else {
        res.render("index")
    }

})

controller.get("/register", (req, res) => {
    res.render("register")
})

controller.get("/login", (req, res) => {
    res.render("login")
})

const {authenticateRegistration, authenticateLogin} = require("./model/authentication")
controller.post("/auth/register", (req, res) => {
    return authenticateRegistration(req, res)
})

controller.post("/auth/login", (req, res) => {
    return authenticateLogin(req, res)
})
