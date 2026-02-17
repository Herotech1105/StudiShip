module.exports = {saveMessage}

function saveMessage(message, db) {
    const roomId = message.roomId
    const content = message.content
    const timestamp = message.timestamp
    const user = message.user
    db.query('SELECT users.id FROM users WHERE users.name = ? ', [user], async (error, userId) => {
        db.query('INSERT INTO messages (user_id, room_id, content, timestamp) VALUES (?, ?, ?, ?) ', [userId[0].id, roomId, content, timestamp], async (error, success) => {
            console.log(userId[0].id)
        })
    })
}