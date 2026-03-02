const fs = require('node:fs/promises')
const subjects = async () => {
    const list = []
    const fileData = await fs.readFile('./subjectList.txt', 'utf8')
    fileData.split(/\r\n/).forEach(line => {
        list.push(line)
    })
    return list
}

// Reads all lines from subjectList.txt and returns them as an array of subjects.

module.exports = subjects