class Service {
    constructor() {
        const DbHandler = require("../dbHandler/dbHandler");
        this.db = new DbHandler();
    }

    login(req, res) {
        const {authenticateLogin} = require("./authentication")
        return authenticateLogin(req, res, this.db.connection);
    }

    register(req, res) {
        const {authenticateRegistration} = require("./authentication")
        return authenticateRegistration(req, res, this.db.connection);
    }

    dashboard(req, res) {
        const {dashboardWithRoomList} = require("./roomManager")
        return dashboardWithRoomList(req, res, this.db.connection)
    }

    room(req, res) {
        const {loadRoom} = require("./roomManager")
        return loadRoom(req, res, this.db.connection);
    }

    createRoom(req, res) {
        const user = req.signedCookies["user"]
        if (!user) {
            res.redirect("/login", {
                message: "You need to sign in to create a new room"
            })
        }
        const {createRoom} = require("./roomManager")
        return createRoom(req, res, this.db.connection)
    }

}

module.exports = Service