module.exports = {dashboardWithRoomList, loadRoom, createRoom}

function dashboardWithRoomList(req, res, db) {
    const user = req.signedCookies["user"]
    db.query('SELECT DISTINCT rooms.id, rooms.name FROM rooms RIGHT JOIN roommembers ON roommembers.room_id = rooms.id LEFT JOIN users ON users.id = roommembers.user_id WHERE users.name = ? AND rooms.id IS NOT NULL ', [user], async (error, result) => {
        res.render('dashboard', {
            rooms: result
        })
    })
}

function loadRoom(req, res, db) {
    const roomId = req.query.roomId
    const user = req.signedCookies["user"]
    if (!roomId) {
        res.redirect('/')
    } else {
        db.query('SELECT * FROM rooms WHERE rooms.id = ? ', [roomId], async (error, room) => {
            if (!room) {
                res.redirect('/')
            } else {
                db.query('SELECT users.id FROM (SELECT roommembers.user_id FROM roommembers WHERE roommembers.room_id = ?) members LEFT JOIN users ON users.id = members.user_id WHERE users.name = ? ', [roomId, user], async (error, result) => {
                    if (result.length === 0) {
                        if (room[0].privacy !== 'private') {
                            db.query('INSERT INTO roommembers (user_id, room_id) VALUES ((SELECT users.id FROM users WHERE users.name = ?), ?)', [user, roomId], async () => {
                            })
                        } else {
                            res.render('dashboard', {
                                message: 'Access denied'
                            })
                        }
                    }
                    db.query('SELECT users.name as user, room_messages.content, room_messages.timestamp FROM (SELECT * FROM messages WHERE messages.room_id = ?) as room_messages LEFT JOIN users ON room_messages.user_id = users.id ', [roomId], async (error, messages) => {
                        db.query('SELECT users.name FROM (SELECT user_id FROM roommembers WHERE room_id = ?) ids left join users ON ids.user_id = users.id', [roomId], async (error, members) => {
                            res.render('room', {
                                room: room[0],
                                messages: messages,
                                members: members
                            })
                        })
                    })
                })

            }
        })
    }

}

function createRoom(req, res, db) {
    const {roomName, roomDescription, roomSubject, roomPrivacy} = req.body
    const owner = req.signedCookies["user"]
    db.query('SELECT rooms.id FROM (SELECT users.id FROM users WHERE users.name = ?) owner  LEFT JOIN rooms ON rooms.owner_id = owner.id ', [owner], async (error, ownedRooms) => {
        if (ownedRooms.length < 4) {
            db.query('INSERT INTO rooms (name, description, owner_id, subject, privacy) VALUES (?, ?, (SELECT users.id FROM users WHERE users.name = ?), ?, ?)', [roomName, roomDescription, owner, roomSubject, roomPrivacy], async () => {
                db.query('SELECT max(rooms.id) AS id FROM rooms', async (error, newRoom) => {
                    res.redirect('/rooms?roomId=' + newRoom[0].id)
                })
            })
        } else {
            res.redirect('/rooms/create')
        }
    })


}