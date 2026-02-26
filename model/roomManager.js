module.exports = {dashboardWithRoomList, loadRoom, createRoom, updateRoom, removeMember, changeOwner, deleteRoom, leaveRoom}

async function dashboardWithRoomList(req, res, db) {
    const user = req.signedCookies["user"]
    res.render('dashboard', {
        rooms: await getRoomsByMember(user, db),
    })
}

async function loadRoom(req, res, db) {
    const roomId = req.query.roomId
    const user = req.signedCookies["user"]
    if (!roomId) {
        res.redirect('/')
    } else {
        const room = await getRoomById(roomId, db)
        if (!room) {
            res.redirect('/')
        } else {
            if (!await isRoomMember(user, roomId, db)) {
                if (room.privacy !== 'private') {
                    await addMember(user, roomId, db)
                } else {
                    res.redirect('/')
                }
            }
            const messages = getMessagesByRoom(roomId, db)
            const members = getRoomMembers(roomId, db)

            room.owner = await getUserNameById(room.owner, db)
            const isOwner = room.owner === user
            const subjects = await require("./subjects")()

            res.render('room', {
                room: room,
                messages: await messages,
                members: await members,
                isOwner: isOwner,
                subjects: subjects
            })

        }
    }
}

async function createRoom(req, res, db) {
    const {roomName, roomDescription, roomSubject, roomPrivacy} = req.body
    const owner = req.signedCookies["user"]
    const subjects = await require("./subjects")()
    if (subjects.includes(roomSubject)) {
        const existingOwnedRooms = await getRoomsByOwner(owner, db)
        if (existingOwnedRooms.length < 4) {
            await addRoom({
                name: roomName,
                description: roomDescription,
                subject: roomSubject,
                privacy: roomPrivacy,
                owner: owner,
            }, db)
            const newRoomId = await getHighestRoomId(db)
            res.redirect('/rooms?roomId=' + newRoomId)
        } else {
            res.redirect('/createRoom')
        }
    }

}

async function updateRoom(room, actor, db) {
    const roomId = Number(room.id)
    if (await isOwner(actor, roomId, db)) {
        await db.promise().query(
            'UPDATE rooms ' +
            'SET name = ? ' +
            ', description = ? ' +
            ', subject = ? ' +
            ', privacy = ? ' +
            'WHERE rooms.id = ? ',
            [room.name, room.description, room.subject, room.privacy, room.id],)
    } else {
        throw Error("You are not the owner of this room")
    }
}

async function removeMember(member, roomId, actor, db) {
    if (await isOwner(actor, roomId, db)) {
        const [error] = await db.promise().query('DELETE FROM roommembers ' +
            'WHERE room_id = ? ' +
            'AND user_id = ' +
            '(SELECT users.id FROM users WHERE users.name = ?)', [roomId, member])
        if (error) {
            console.error(error)
        }
    } else {
        throw Error("You are not the owner of this room")
    }
}

async function leaveRoom(member, roomId, db) {
    const [error] = await db.promise().query('DELETE FROM roommembers ' +
        'WHERE room_id = ? ' +
        'AND user_id = ' +
        '(SELECT users.id FROM users WHERE users.name = ?)', [roomId, member])
    if (error) {
        console.error(error)
    }
}

async function changeOwner(user, roomId, actor, db) {
    if (await isOwner(actor, roomId, db)) {
        const [error] = await db.promise().query('UPDATE rooms ' +
            'SET owner_id = ' +
            '(SELECT users.id FROM users WHERE users.name = ?) ' +
            'WHERE rooms.id = ?', [user, roomId])
        if (error) {
            console.error(error)
        }
    } else {
        throw Error("You are not the owner of this room")
    }
}

async function deleteRoom(roomId, actor, db) {
    const isRoomOwner = await isOwner(actor, roomId, db)
    if (isRoomOwner) {
        await db.promise().query('DELETE FROM rooms WHERE rooms.id = ? ', [roomId])
        await db.promise().query('DELETE FROM roommembers WHERE roommembers.room_id = ? ', [roomId])
        await db.promise().query('DELETE FROM messages WHERE messages.room_id = ? ', [roomId])
    } else {
        throw Error("You are not the owner of this room")
    }
}

// helper functions
async function getHighestRoomId(db) {
    const [id] = await db.promise().query('SELECT max(rooms.id) AS id ' +
        'FROM rooms')
    return id[0].id
}

async function getRoomsByOwner(owner, db) {
    const [rooms] = await db.promise().query('SELECT rooms.id ' +
        'FROM (SELECT users.id FROM users WHERE users.name = ?) owner ' +
        'LEFT JOIN rooms ' +
        'ON rooms.owner_id = owner.id ', [owner])
    return rooms
}

async function getRoomMembers(roomId, db) {
    const [members] = await db.promise().query('SELECT users.name ' +
        'FROM (SELECT user_id ' +
        'FROM roommembers ' +
        'WHERE room_id = ?) ids ' +
        'LEFT JOIN users ' +
        'ON ids.user_id = users.id', [roomId])
    return members
}

async function getRoomsByMember(member, db) {
    const [rooms] = await db.promise().query('SELECT DISTINCT rooms.id, rooms.name, rooms.subject, rooms.description ' +
        'FROM rooms ' +
        'RIGHT JOIN roommembers ' +
        'ON roommembers.room_id = rooms.id ' +
        'LEFT JOIN users ' +
        'ON users.id = roommembers.user_id ' +
        'WHERE users.name = ? ' +
        'AND rooms.id IS NOT NULL ',
        [member]
    )
    return rooms
}

async function getMessagesByRoom(roomId, db) {
    const [messages] = await db.promise().query("SELECT users.name as user, room_messages.content, DATE_FORMAT(room_messages.timestamp, '%Y-%m-%d %H:%i:%s') AS timestamp " +
        'FROM (SELECT * FROM messages WHERE messages.room_id = ?) room_messages ' +
        'LEFT JOIN users ' +
        'ON room_messages.user_id = users.id ', [roomId])
    return messages
}

async function getRoomById(roomId, db) {
    const [room] = await db.promise().query('SELECT id, name, description, subject, privacy, owner_id AS owner FROM rooms WHERE rooms.id = ? ', [roomId])
    return room[0]
}

async function getUserNameById(userId, db) {
    const [user] = await db.promise().query('SELECT users.name FROM users WHERE users.id = ?', [userId])
    return user[0].name
}

async function addMember(user, roomId, db) {
    await db.promise().query('INSERT INTO roommembers (user_id, room_id) ' +
        'VALUES (' +
        '(SELECT users.id FROM users WHERE users.name = ?), ?)', [user, roomId])
}

async function addRoom(room, db) {
    await db.promise().query('INSERT INTO rooms (name, description, owner_id, subject, privacy) ' +
        'VALUES (?, ?, ' +
        '(SELECT users.id FROM users WHERE users.name = ?), ' +
        '?, ?)', [room.name, room.description, room.owner, room.subject, room.privacy])
}

async function isRoomMember(user, roomId, db) {
    const [result] = await db.promise().query('SELECT users.id ' +
        'FROM (SELECT roommembers.user_id ' +
        'FROM roommembers ' +
        'WHERE roommembers.room_id = ?) members ' +
        'LEFT JOIN users ' +
        'ON users.id = members.user_id ' +
        'WHERE users.name = ? ', [roomId, user])
    return result.length > 0
}

async function isOwner(user, roomId, db) {
    const ownedRooms = await getRoomsByOwner(user, db)
    for (let i = 0; i < ownedRooms.length; i++) {
        if (ownedRooms[i].id === roomId) {
            return true
        }
    }
    return false
}

