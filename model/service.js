const {createRoom} = require("./roomManager");
const {findRooms} = require("./searchManager");

class Service {
    constructor(db) {
        // receives requests and forwards the actual work to specialized modules
        this.db = db;
    }

    frontPage(req, res) {
        // Show the dashboard for logged-in users, otherwise show the public landing page
        const user = req.signedCookies["user"]
        if (user) {
            const {dashboardWithRoomList} = require("./roomManager")
            dashboardWithRoomList(req, res, this.db.connection)
        } else {
            res.render("index")
        }
    }

    login(req, res) {
        // Delegate login validation and session/cookie handling to the authentication module
        const {authenticateLogin} = require("./authentication")
        authenticateLogin(req, res, this.db.connection);
    }

    register(req, res) {
        // Delegate registration validation and account creation to the authentication module
        const {authenticateRegistration} = require("./authentication")
        authenticateRegistration(req, res, this.db.connection);
    }

    logout(req, res) {
        // End the session by clearing the signed user cookie
        res.clearCookie("user")
        res.redirect("/")
    }

    room(req, res) {
        // Allow room access only for allowed users
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
        // Load the allowed subjects list and render the room creation page with that data
        require("./subjects")().then((subjects) => {
            res.render("roomAdder", {
                subjects: subjects
            })
        })
    }

    createRoom(req, res) {
        // Only logged-in users can create rooms
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
        // save a chat message through messageManager
        const {saveMessage} = require("./messageManager")
        saveMessage(message, this.db.connection)
    }

    search(req, res) {
        // Render the search page and show the subjects list for filter options.
        require("./subjects")().then((subjects) => {
            res.render("search", {
                subjects: subjects
            })
        })
    }

    findRooms(req, res) {
        // Room search only for authenticated users and return matching room results.
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
        // Remove a member from a room, with permission from roomManager
        const {removeMember} = require("./roomManager")
        await removeMember(user, Number(roomId), actor, this.db.connection)
    }

    async leaveRoom(user, roomId, actor) {
        // Remove the current user from the given room
        const {leaveRoom} = require("./roomManager")
        await leaveRoom(user, roomId, this.db.connection)
    }

    async changeOwner(user, roomId, actor) {
        // Transfer room ownership to another user
        const {changeOwner} = require("./roomManager")
        await changeOwner(user, Number(roomId), actor, this.db.connection)
    }

    async updateRoom(room, actor) {
        // Update room data (name/description/subject/privacy) via roomManager
        const {updateRoom} = require("./roomManager")
        await updateRoom(room, actor, this.db.connection)
    }

    async deleteRoom(roomId, actor) {
        // Delete a room by ID, including server-side authorization checks in roomManager
        const {deleteRoom} = require("./roomManager")
        await deleteRoom(Number(roomId), actor, this.db.connection)
    }

}

async function createService() {
    // Build the DB connection once and expose a ready-to-use service instance
    const {createDBConnection} = require("../dbHandler/createDBConnection");
    const db = await createDBConnection()
    return new Service(db)
}

module.exports = createService
