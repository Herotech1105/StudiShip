module.exports = {saveMessage}

async function saveMessage(message, db) {
    const roomId = message.roomId
    const content = message.content
    const timestamp = message.timestamp
    const user = message.user
    const userId = await getUserId(user, db)
    db.query('INSERT INTO messages (user_id, room_id, content, timestamp) ' +
        'VALUES (?, ?, ?, ?) ', [userId, roomId, content, timestamp], async (error, success) => {
    })

}

async function getUserId(user, db) {
    const [id] = await db.promise().query('SELECT users.id ' +
        'FROM users ' +
        'WHERE users.name = ? ', [user])
    return id[0].id
}