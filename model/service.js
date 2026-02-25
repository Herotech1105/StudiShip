const {createRoom} = require("./roomManager");
const {findRooms} = require("./searchManager");

class Service {
    constructor(db) {
        this.db = db;
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

    logout(req, res) {
        res.clearCookie("user")
        res.redirect("/")
    }

    room(req, res) {
        const user = req.signedCookies["user"]
        if (!user) {
            res.redirect('/login')
        } else {
            try {
                const {loadRoom} = require("./roomManager")
                loadRoom(req, res, this.db.connection)
            } catch (err) {
                res.redirect('/')
            }
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
            try {
                const {createRoom} = require("./roomManager")
                createRoom(req, res, this.db.connection)
            }
            catch (err) {
                res.redirect('/createRoom')
            }
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
            try{
                const {findRooms} = require("./searchManager")
                findRooms(req, res, this.db.connection)
            } catch(err) {
                res.redirect('/')
            }

        }
    }

    async removeUser(user, roomId, actor) {
        const {removeMember} = require("./roomManager")
        await removeMember(user, Number(roomId), actor, this.db.connection)
    }

    async leaveRoom(user, roomId, actor) {
        const {leaveRoom} = require("./roomManager")
        await leaveRoom(user, roomId, this.db.connection)
    }

    async changeOwner(user, roomId, actor) {
        const {changeOwner} = require("./roomManager")
        await changeOwner(user, Number(roomId), actor, this.db.connection)
    }

    async updateRoom(room, actor) {
        const {updateRoom} = require("./roomManager")
        await updateRoom(room, actor, this.db.connection)
    }

    async deleteRoom(roomId, actor) {
        const {deleteRoom} = require("./roomManager")
        await deleteRoom(Number(roomId), actor, this.db.connection)
    }

}

async function createService() {
    const {createDBConnection} = require("../dbHandler/createDBConnection");
    const db = await createDBConnection()
    return new Service(db)
}

module.exports = createService