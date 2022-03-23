module.exports = function toLowerSnakeCase(str) {
    if (!str)
        return

    return str.trim()
        .toLowerCase()
        .replace(' ', '_');
}