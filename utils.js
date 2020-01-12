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
