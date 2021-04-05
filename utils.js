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
    return (new Date(time)).toISOString().replace(/:|-|\./g, "")
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

    let base = (new Date()).setUTCHours(9, 0, 0, 0)
    let id = 0
    const hourMs = 3600 * 1000
    for (let i = -7; i <= 7; i++) {

        let time = base + (i * hourMs * 24)
        if (!((new Date(time)).getUTCDay() in [0, 6])) {
            for (let j = 0; j < 3; j++) {
                ret += makeEvent(id, time, time + hourMs, "Zoom", "Lecture " + (j + 1))
                id++
            }
        }
    }

    return ret
}
