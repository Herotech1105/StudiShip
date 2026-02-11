class DbHandler {
    connection

    constructor() {
        const dotenv = require("dotenv")
        const mysql = require("mysql2")

        dotenv.config({path: "./.env"})

        this.connection = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE
        })

        this.connection.connect((error) => {
            if (error) {
                console.log(error)
            } else {
                console.log("MySQL connected!")
            }
        })
    }

}

module.exports = DbHandler