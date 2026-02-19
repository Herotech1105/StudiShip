async function createDBConnection() {
    const dotenv = require("dotenv")
    const mysql = require("mysql2/promise")

    dotenv.config({path: "./.env"})

    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    })
    return connection
}

module.exports = {createDBConnection}