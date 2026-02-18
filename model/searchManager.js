module.exports = {findRooms}

function findRooms(req, res, db) {
    const {roomName, roomSubject} = req.body
    const user = req.signedCookies['user']
    db.query('SELECT users.id ' +
        'FROM users ' +
        'WHERE users.name = ?', [user], async (error, userId) => {
        if (roomName && roomSubject !== "any") {
            db.query("SELECT * FROM rooms LEFT JOIN (SELECT roommembers.room_id FROM roommembers WHERE roommembers.user_id = ?) member ON member.room_id = rooms.id WHERE member.room_id IS NULL AND rooms.privacy = 'public' AND rooms.name LIKE ? AND rooms.subject = ?", [userId[0].id, "%" + roomName + "%", roomSubject], async (error, rooms) => {
                res.render('searchResult', {
                    rooms: rooms,
                })
            })
        } else if (roomSubject !== "any") {
            db.query("SELECT * FROM rooms LEFT JOIN (SELECT roommembers.room_id FROM roommembers WHERE roommembers.user_id = ?) member ON member.room_id = rooms.id WHERE member.room_id IS NULL AND rooms.privacy = 'public' AND rooms.subject = ?" , [userId[0].id, roomSubject], async (error, rooms) => {
                res.render('searchResult', {
                    rooms: rooms,
                })
            })
        } else if (roomName) {
            db.query("SELECT * FROM rooms LEFT JOIN (SELECT roommembers.room_id FROM roommembers WHERE roommembers.user_id = ?) member ON member.room_id = rooms.id WHERE member.room_id IS NULL AND rooms.privacy = 'public' AND rooms.name LIKE ?", [userId[0].id, "%" + roomName + "%"], async (error, rooms) => {
                res.render('searchResult', {
                    rooms: rooms,
                })
            })
        } else {
            db.query("SELECT * FROM rooms LEFT JOIN (SELECT roommembers.room_id FROM roommembers WHERE roommembers.user_id = ?) member ON member.room_id = rooms.id WHERE member.room_id IS NULL AND rooms.privacy = 'public'", [userId[0].id], async (error, rooms) => {
                res.render('searchResult', {
                    rooms: rooms,
                })
            })
        }
    })

}