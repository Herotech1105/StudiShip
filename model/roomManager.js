module.exports = {dashboardWithRoomList}

function dashboardWithRoomList(req, res, db) {
    const user = req.signedCookies["user"]
    db.query('SELECT DISTINCT rooms.id, rooms.name FROM rooms RIGHT JOIN roommembers ON roommembers.room_id = rooms.id LEFT JOIN users ON users.id = roommembers.user_id WHERE users.name = ?', [user], async (error, result) => {
        return res.render('dashboard', {
            rooms: result
        })
    })
}