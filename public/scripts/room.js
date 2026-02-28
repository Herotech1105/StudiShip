const websocket = io()
const searchParams = new URLSearchParams(window.location.search)
const roomId = searchParams.get('roomId')

const isOwner = document.body.dataset.isOwner === "true"
let isEditMode = false
let pendingAction = null
let activePopup = null

const kickPopup = document.querySelector(".user-kick-confirmation-window")
const ownerPopup = document.querySelector(".new-admin-confirmation-window")
const deletePopup = document.querySelector(".delition-confirmation-window")

websocket.emit("open", roomId)

const messageInput = document.getElementById("message")
if (messageInput) {
    messageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault()
            sendMessage()
        }
    })
}


function sendMessage() {
    const input = document.getElementById('message')
    if (!input || !input.value.trim()) return

    const message = {
        user: "",
        content: input.value.trim(),
        timestamp: 0,
        roomId: roomId
    }
    websocket.emit('message', JSON.stringify(message))
    input.value = ''
}

async function copyRoomLink() {
    if (!roomId) return false

    const roomUrl = `${window.location.origin}/rooms?roomId=${encodeURIComponent(roomId)}`
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(roomUrl)
        } else {
            const tempInput = document.createElement("input")
            tempInput.value = roomUrl
            document.body.appendChild(tempInput)
            tempInput.select()
            document.execCommand("copy")
            document.body.removeChild(tempInput)
        }
        return true
    } catch (error) {
        console.error("Link konnte nicht kopiert werden:", error)
        return false
    }
}

function hideAllPopups() {
    if (kickPopup) kickPopup.style.display = "none"
    if (ownerPopup) ownerPopup.style.display = "none"
    if (deletePopup) deletePopup.style.display = "none"
    activePopup = null
    pendingAction = null
}

function openPopup(popupElement, onConfirm) {
    hideAllPopups()
    if (!popupElement) return
    activePopup = popupElement
    pendingAction = onConfirm
    popupElement.style.display = "flex"
}

function deleteRoom(){
    openPopup(deletePopup, () => {
        websocket.emit('delete', roomId)
    })
}

function updateRoom(){
    if (!isOwner || !isEditMode) return

    const title = document.getElementById('roomTitle')
    const description = document.getElementById('roomDescription')
    const subject = document.getElementById('roomSubject')
    const subjectText = document.getElementById('roomSubjectText')

    const room = {
        id: roomId,
        name: title ? title.textContent.trim() : "",
        description: description ? description.textContent.trim() : "",
        subject: subject ? subject.value : (subjectText ? subjectText.textContent.trim() : ""),
        privacy: "public"
    }
    websocket.emit('updateRoom', room)
    setEditMode(false)
}

function changeOwner(owner){
    openPopup(ownerPopup, () => {
        websocket.emit('changeOwner', owner, roomId)
    })
}

function removeUser(user){
    openPopup(kickPopup, () => {
        websocket.emit('removeUser', user, roomId)
    })
}

function setEditMode(enabled) {
    if (!isOwner) return
    isEditMode = enabled
    const roomOwner = document.body.dataset.roomOwner

    const title = document.getElementById("roomTitle")
    const description = document.getElementById("roomDescription")
    const subjectText = document.getElementById("roomSubjectText")
    const subjectSelect = document.getElementById("roomSubject")

    const editButton = document.getElementById("editButton")
    const saveButton = document.getElementById("saveButton")
    const deleteButton = document.getElementById("deleteButton")

    if (title) title.contentEditable = enabled ? "true" : "false"
    if (description) description.contentEditable = enabled ? "true" : "false"

    if (subjectText) subjectText.classList.toggle("hidden", enabled)
    if (subjectSelect) subjectSelect.classList.toggle("hidden", !enabled)

    if (editButton) editButton.classList.toggle("hidden", enabled)
    if (saveButton) saveButton.classList.toggle("hidden", !enabled)
    if (deleteButton) deleteButton.classList.toggle("hidden", !enabled)

    document.querySelectorAll(".owner-edit-only").forEach((el) => {
        const memberName = el.closest("li")?.querySelector("span")?.textContent?.trim()
        const isSelfRow = memberName === roomOwner
        el.classList.toggle("hidden", !enabled || isSelfRow)
    })
}

function editRoom() {
    setEditMode(true)
}

websocket.on("message", message => {
    const messageObject = JSON.parse(message)
    const messageList = document.getElementById('messages')
    if (!messageList) return

    const messageEntry = document.createElement("li")
    messageEntry.className = "message-bubble"

    const userText = document.createTextNode(messageObject.user)
    const time = document.createElement("small")
    time.textContent = `[${messageObject.timestamp}]`
    const sep = document.createTextNode(": ")
    const content = document.createTextNode(messageObject.content)

    messageEntry.appendChild(userText)
    messageEntry.appendChild(time)
    messageEntry.appendChild(sep)
    messageEntry.appendChild(content)

    messageList.appendChild(messageEntry)
    scrollMessagesToBottom()
})

function scrollMessagesToBottom() {
    const messageList = document.getElementById("messages")
    if (!messageList) return
    messageList.scrollTop = messageList.scrollHeight
}

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

websocket.on("invalid", (err) => {
    console.log(err)
})

document.addEventListener("DOMContentLoaded", () => {
    hideAllPopups()

    document.getElementById("kick-confirmation")?.addEventListener("click", () => {
        pendingAction?.()
        hideAllPopups()
    })
    document.getElementById("kick-rejected")?.addEventListener("click", hideAllPopups)

    document.getElementById("new-admin-confirmation")?.addEventListener("click", () => {
        pendingAction?.()
        hideAllPopups()
    })
    document.getElementById("new-admin-rejected")?.addEventListener("click", hideAllPopups)

    document.getElementById("delition-confirmation")?.addEventListener("click", () => {
        pendingAction?.()
        hideAllPopups()
    })
    document.getElementById("delition-rejected")?.addEventListener("click", hideAllPopups)

    const shareButton = document.querySelector(".share-btn")
    if (shareButton) {
        shareButton.addEventListener("click", async () => {
            const success = await copyRoomLink()
            const originalText = shareButton.textContent
            shareButton.textContent = success ? "Link kopiert" : "Kopieren fehlgeschlagen"
            setTimeout(() => {
                shareButton.textContent = originalText
            }, 1500)
        })
    }

    if (isOwner) setEditMode(false)
    scrollMessagesToBottom()
})
