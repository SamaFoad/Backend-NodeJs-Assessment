const isObject = require("./is-object")

module.exports = function removeKeys(obj, keys, replacement) {
    if(!isObject(obj))
        return
        
    for (const key of Object.keys(obj)) {
        if (keys.includes(key)) {
            if (replacement)
                obj[key] = replacement
            else
                delete obj[key]
        }else if (typeof obj[key] == 'object')
            removeKeys(obj[key], keys, replacement)
    }

    return obj
}