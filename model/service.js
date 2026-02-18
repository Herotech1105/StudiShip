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
            res.redirect('/login')
        } else {
            const {loadRoom} = require("./roomManager")
            loadRoom(req, res, this.db.connection)
        }
    }

    roomAdder(req, res) {
        require("./subjects")().then((subjects) => {
            res.render("roomAdder", {
                subjects: subjects
            })
        })
    }

    createRoom(req, res) {
        const user = req.signedCookies["user"]
        if (!user) {
            res.redirect("/")
        } else {
            const {createRoom} = require("./roomManager")
            createRoom(req, res, this.db.connection)
        }
    }

    saveMessage(message) {
        const {saveMessage} = require("./messageManager")
        saveMessage(message, this.db.connection)
    }

    search(req, res) {
        require("./subjects")().then((subjects) => {
            res.render("search", {
                subjects: subjects
            })
        })
    }

    findRooms(req, res) {
        const user = req.signedCookies["user"]
        if (!user) {
            res.redirect("/")
        } else {
            const {findRooms} = require("./searchManager")
            findRooms(req, res, this.db.connection)
        }
    }

}

module.exports = Service