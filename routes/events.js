const request = require('request')

const utils = require('../utils')
const icalendar = require('../icalendar')
const database = require('../database')
const config = require('../config')

function eventsEqual(event1, event2) {
    return event1.start === event2.start
        && event1.end === event2.end
        && event1.location === event2.location
        && event1.summary === event2.summary
}

function callback(req, res) {
    const url = req.query.url
    const version = req.query.version

    if (utils.isStringEmpty(url) || utils.isEmpty(version)) {
        res.statusCode = 400
        res.end()
        return
    }

    if (config.mock) {
        onUrlResponse(res, 'mock', version, utils.mockCalendar())
            .then(() => {
            })
            .catch(error => {
                res.statusCode = 500
                res.end()
                throw error
            })
        return
    }

    request(url, (error, response, body) => {
        if (error !== null || response === null) {
            res.statusCode = 500
            res.end()
        } else {
            onUrlResponse(res, url, version, body)
                .then(() => {
                })
                .catch(error => {
                    res.statusCode = 500
                    res.end()
                    throw error
                })
        }
    })
}

async function onUrlResponse(myResponse, url, version, body) {
    let fetchedEvents = icalendar.parseICalendar(body, field => {
        return [
            'DTSTART',
            'DTEND',
            'LOCATION',
            'SUMMARY'
        ].includes(field)
    }, field => {
        const map = {
            'DTSTART': 'start',
            'DTEND': 'end',
            'LOCATION': 'location',
            'SUMMARY': 'summary'
        }
        return map[field]
    })

    const fetchedEventsByStart = {}
    fetchedEvents.forEach(it => {
        if (fetchedEventsByStart.hasOwnProperty(it.start)) {
            fetchedEventsByStart[it.start].push(it)
        } else {
            fetchedEventsByStart[it.start] = [it]
        }
    })

    let calendar = await database.Calendar.findOne({
        where: {url: url},
        include: [database.Event]
    })

    if (calendar === null) {
        calendar = await database.Calendar.create({
            url: url,
            version: 0
        })
        calendar.Events = []
    }

    const currentVersion = calendar.version
    const newVersion = currentVersion + 1
    await calendar.update({version: newVersion})

    const ret = {
        objects: [],
        version: newVersion
    }

    const events = await calendar.getEvents()

    const eventsByStart = {}
    events.forEach(it => {
        if (eventsByStart.hasOwnProperty(it.start)) {
            eventsByStart[it.start].push(it)
        } else {
            eventsByStart[it.start] = [it]
        }
    })

    events.forEach(it => {
        if (it.deleted) return

        let same = false
        if (!utils.isEmpty(fetchedEventsByStart[it.start])) {
            fetchedEventsByStart[it.start].forEach(fetched => {
                if (eventsEqual(fetched, it)) {
                    same = true
                }
            })
        }

        if (!same) {
            it.update({deleted: true, version: newVersion})
            it.deleted = true
            it.version = newVersion
        }
    })

    events.forEach(it => {
        if (it.version > version) {
            ret.objects.push(it)
        }
    })

    let index
    for (index = 0; index < fetchedEvents.length; index++) {
        const it = fetchedEvents[index]
        let same = null
        if (!utils.isEmpty(eventsByStart[it.start])) {
            eventsByStart[it.start].forEach(saved => {
                if (eventsEqual(saved, it)) {
                    same = saved
                }
            })
        }

        if (same == null) {
            it.version = newVersion
            const dbEntry = await database.Event.create(it)
            calendar.addEvent(dbEntry)
            it.id = dbEntry.id
            it.deleted = false
            ret.objects.push(it)
        } else if (same.deleted) {
            same.update({deleted: false, version: newVersion})
            it.id = same.id
            it.deleted = false
            ret.objects.push(it)
        }
    }

    ret.count = ret.objects.length
    myResponse.send(JSON.stringify(
        ret,
        ['objects', 'count', 'id', 'version', 'start', 'end', 'summary', 'location', 'deleted']
    ))
}

module.exports = app => {
    app.get('/v1/events', callback)
}
