module.exports = {authenticateRegistration, authenticateLogin}

const dotenv = require("dotenv")
const mysql = require("mysql2")

dotenv.config({path: "./.env"})

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})


function authenticateLogin(req, res) {
    const {name, password} = req.body
    db.query('SELECT password FROM users WHERE name = ?', [name], async (error, result) => {
        try {
            if (result.length === 0) {
                return res.render('login', {
                    message: `No user under ${name} registered`,
                })
            } else if (password !== result[0].password) {
                return res.render('login', {
                    message: 'Wrong password!',
                    name: name
                })
            } else {
                res.cookie('user', name)
                return res.render('index', {
                    user: name
                })
            }

        } catch (err) {
            console.log(err)
            return res.render('login', {
                message: 'An unexpected error occurred',
                name: name
            })
        }
    })
}

function authenticateRegistration(req, res) {
    const {name, email, password, password_confirm} = req.body
    try {
        if (password !== password_confirm) {
            return res.render('register', {
                message: 'Passwords do not match!',
                name: name,
                email: email
            })
        } else {
            db.query('SELECT email, name FROM users WHERE email = ? or name = ?', [email, name], async (error, result) => {
                if (result.length !== 0 && result[0].email === email) {
                    return res.render('register', {
                        message: 'This email is already in use',
                        name: name
                    })
                } else if (result.length !== 0 &&  result[0].name === name) {
                    return res.render('register', {
                        message: 'This username is already taken',
                        email: email
                    })
                } else {
                    db.query('INSERT INTO users SET ? ', {
                        name: name,
                        email: email,
                        password: password
                    }, () => {
                    })
                    res.cookie('user', name)
                    return res.render('index', {
                        user: name
                    })
                }
            })
        }
    } catch (err) {
        console.log(err)
        return res.render('register', {
            message: 'An unexpected error occurred',
            email: email,
            name: name
        })
    }
}