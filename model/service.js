const {createRoom} = require("./roomManager");

class Service {
    constructor() {
        const DbHandler = require("../dbHandler/dbHandler");
        this.db = new DbHandler();
    }

    frontPage(req, res) {
        const user = req.signedCookies["user"]
        if (user) {
            const {dashboardWithRoomList} = require("./roomManager")
            dashboardWithRoomList(req, res, this.db.connection)
        } else {
            res.render("index")
        }
    }

    login(req, res) {
        const {authenticateLogin} = require("./authentication")
        authenticateLogin(req, res, this.db.connection);
    }

    register(req, res) {
        const {authenticateRegistration} = require("./authentication")
        authenticateRegistration(req, res, this.db.connection);
    }

    room(req, res) {
        const user = req.signedCookies["user"]
        if (!user) {
            res.redirect("/login", {
                message: "You need to sign in to participate with this room!"
            })
        }
        const {loadRoom} = require("./roomManager")
        loadRoom(req, res, this.db.connection);
    }

    createRoom(req, res) {
        const user = req.signedCookies["user"]
        if (!user) {
            res.status("200")
            res.redirect("/")
        } else {
            const {createRoom} = require("./roomManager")
            createRoom(req, res, this.db.connection)
        }
    }

}

module.exports = Service