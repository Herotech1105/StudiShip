const websocket = io()
const searchParams = new URLSearchParams(window.location.search)
const roomId = searchParams.get('roomId')
websocket.emit("room", roomId)

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

websocket.on("message", message => {
    const messageObject = JSON.parse(message)
    const messageList = document.getElementById('messages')
    const textMessage = document.createTextNode(messageObject.user + "[" + messageObject.timestamp + "]: " + messageObject.content)
    const messageEntry = document.createElement("li")
    messageEntry.appendChild(textMessage)
    messageList.appendChild(messageEntry)
})