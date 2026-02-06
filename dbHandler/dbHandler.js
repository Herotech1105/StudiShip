class DbHandler{
    db
    constructor(){
        const dotenv = require("dotenv")
        const mysql = require("mysql2")

        dotenv.config({path: "./.env"})

        this.db = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE
        })

        this.db.connect((error) => {
            if (error) {
                console.log(error)
            } else {
                console.log("MySQL connected!")
            }
        })
    }

}