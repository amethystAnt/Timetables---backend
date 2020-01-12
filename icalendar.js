exports.parseICalendar = (icalendar, includeCallback, transformCallback) => {
    let ret = []

    let index = icalendar.indexOf('BEGIN:VEVENT')
    while (index >= 0) {
        index += 'BEGIN:VEVENT'.length + 1
        if (icalendar[index] == '\n') {
            index++
        }

        let object = { }
        
        while (icalendar.substring(index).startsWith('END:VEVENT') == false) {
            let line = icalendar.substring(index, icalendar.indexOf('\n', index))
            let fieldName = line.substring(0, line.indexOf(':'))
            let value = line.substring(fieldName.length + 1)
            if (value.endsWith('\r')) {
                value = value.substring(0, value.length - 1)
            }

            if (includeCallback(fieldName)) {
                object[transformCallback(fieldName)] = value
            }

            index += line.length + 1
        }

        ret.push(object)
        index = icalendar.indexOf('BEGIN:VEVENT', index)
    }

    return ret
}
