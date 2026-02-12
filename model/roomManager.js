module.exports = {dashboardWithRoomList, room}

function dashboardWithRoomList(req, res, db) {
    const user = req.signedCookies["user"]
    db.query('SELECT DISTINCT rooms.id, rooms.name FROM rooms RIGHT JOIN roommembers ON roommembers.room_id = rooms.id LEFT JOIN users ON users.id = roommembers.user_id WHERE users.name = ?', [user], async (error, result) => {
        return res.render('dashboard', {
            rooms: result
        })
    })
}

function room(req, res, db) {
    const roomId = req.query.roomId
    db.query('SELECT * FROM rooms WHERE rooms.id = ? ', [roomId], async (error, room) => {
        db.query('SELECT users.name as user, room_messages.content, room_messages.timestamp FROM (SELECT * FROM messages WHERE messages.room_id = ?) as room_messages LEFT JOIN users ON room_messages.user_id = users.id ? ', [roomId], async (error, messages) => {
            db.query('SELECT users.name FROM (SELECT user_id FROM roommembers WHERE room_id = ?) ids left join users ON ids.user_id = users.id', [roomId], async (error, members) => {
                console.log(room[0], messages, members)
                return res.render('room', {
                    room: room[0],
                    messages: messages,
                    members: members
                })
            })
        })
    })
}