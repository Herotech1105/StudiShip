module.exports = {authenticateRegistration, authenticateLogin}


function authenticateLogin(req, res, db) {
    const {name, password} = req.body
    db.query('SELECT password FROM users WHERE name = ?', [name], async (error, result) => {
        try {
            if (result.length === 0) {
                res.render('login', {
                    message: `No user under ${name} registered`,
                })
            } else if (password !== result[0].password) {
                res.render('login', {
                    message: 'Wrong password!',
                    name: name
                })
            } else {
                res.cookie('user', name, {signed: true, httpOnly: true})
                res.redirect("/")
            }

        } catch (err) {
            console.log(err)
            res.render('login', {
                message: 'An unexpected error occurred',
                name: name
            })
        }
    })
}

function authenticateRegistration(req, res, db) {
    const {name, email, password, password_confirm} = req.body
    try {
        if (password !== password_confirm) {
            res.render('register', {
                message: 'Passwords do not match!',
                name: name,
                email: email
            })
        } else {
            db.query('SELECT email, name ' +
                'FROM users ' +
                'WHERE email = ? ' +
                'OR name = ?', [email, name], async (error, result) => {
                if (result.length !== 0 && result[0].email === email) {
                    res.render('register', {
                        message: 'This email is already in use',
                        name: name
                    })
                } else if (result.length !== 0 && result[0].name === name) {
                    res.render('register', {
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
                    res.cookie('user', name, {signed: true, httpOnly: true})
                    res.redirect("/")
                }
            })
        }
    } catch (err) {
        console.log(err)
        res.render('register', {
            message: 'An unexpected error occurred',
            email: email,
            name: name
        })
    }
}