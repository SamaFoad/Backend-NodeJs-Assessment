const isObject = require("./is-object");

module.exports = function removeEmptyKeys(obj) {
    if (!isObject(obj))
        return
        
    for (let key in obj) {
        if (obj[key] === undefined || obj[key] === null)
            delete obj[key]
        else if (obj[key].constructor === Object && isEmpty(obj[key]))
            delete obj[key]
    }
    return obj
}

function isEmpty(obj) {
    for (let i in obj) return false;
    return true
}