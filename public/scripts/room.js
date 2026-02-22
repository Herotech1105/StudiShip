const websocket = io()
const searchParams = new URLSearchParams(window.location.search)
const roomId = searchParams.get('roomId')
websocket.emit("open", roomId)

function sendMessage() {
    const input = document.getElementById('message')
    const message = {
        user: "",
        content: input.value,
        timestamp: 0,
        roomId: roomId
    }
    websocket.emit('message', JSON.stringify(message))
    input.value = ''

}

function deleteRoom(){
    websocket.emit('delete', roomId)
}

function updateRoom(room){
    websocket.emit('updateRoom', room)
}

function changeOwner(owner){
    websocket.emit('changeOwner', owner, roomId)
}

function removeUser(user){
    websocket.emit('removeUser', user, roomId)
}

websocket.on("message", message => {
    const messageObject = JSON.parse(message)
    const messageList = document.getElementById('messages')
    const textMessage = document.createTextNode(messageObject.user + "[" + messageObject.timestamp + "]: " + messageObject.content)
    const messageEntry = document.createElement("li")
    messageEntry.appendChild(textMessage)
    messageList.appendChild(messageEntry)
})

websocket.on("kick", () => {
    location.replace("/")
})

websocket.on("kickedUser", (user) => {
    const memberList = document.getElementById('memberList')
    const kickedUser = document.getElementById(user)
    if(memberList && kickedUser){
        memberList.removeChild(kickedUser)
    }
})

websocket.on("deleteRoom", () => {
    location.replace("/")
})

websocket.on("updateRoom", (room) => {
    const title = document.getElementById("roomTitle")
    if(title && room.name){
        title.textContent = room.name
    }
})

websocket.on("changeOwner", (owner) => {
    const ownerElement = document.getElementById("roomOwner")
    if(ownerElement){
        ownerElement.textContent = owner
    }
})