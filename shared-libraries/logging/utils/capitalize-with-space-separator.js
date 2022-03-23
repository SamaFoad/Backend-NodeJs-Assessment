module.exports = function capitalizeWithSpaceSeparator(str) {
    str = str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    let words = str.split(/[,_\-.]/)
    words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1))
    return words.join(' ')
}