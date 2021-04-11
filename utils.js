exports.isEmpty = val => {
    return typeof val === 'undefined' || val === null
}

exports.isStringEmpty = val => {
    return exports.isEmpty(val) || val.length == 0
}

exports.statusOk = code => {
    return code >= 200 && code < 300
}

exports.isSource = file => {
    return file.endsWith('.js') || file.endsWith('.ts')
}

function formatTime(time) {
    let iso = (new Date(time)).toISOString().replace(/:|-|\./g, "")
    if (iso.length > 15) {
        iso = iso.substring(0, 15) + 'Z'
    }

    return iso
}

function makeEvent(uid, start, end, location, description) {
    return `BEGIN:VEVENT
UID:${uid}
DTSTART:${formatTime(start)}
DTEND:${formatTime(end)}
LOCATION:${location}
SUMMARY:${description}
END:VEVENT
`
}

exports.mockCalendar = () => {
    let ret = ""

    let base = (new Date()).setUTCHours(10, 0, 0, 0)
    let id = 0
    const hourMs = 3600 * 1000
    for (let i = -7; i <= 7; i++) {
        let time = base + (i * hourMs * 24)
        for (let j = 0; j < 3; j++) {
            let add = j === 0 ? j : (j - 1)
            let start = time + (add * hourMs)
            let date = new Date(start)
            let day = date.getDay()
            let month = date.getMonth()
            ret += makeEvent(id, start, start + hourMs - 1000, "Zoom", `Lecture ${j + 1} ${day}/${month}`)
            id++
        }
    }

    return ret
}
