class Service {
    db

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

}

module.exports = Service