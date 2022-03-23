const { format } = require("winston");

module.exports = format((info, { stack = true, overrideMessage = false }) => {
    if (info instanceof Error) {
        const info = Object.assign({}, info, {
            level: info.level,
            [Symbol.for('level')]: info[Symbol.for('level')] || info.level,
            message: info.message,
            [Symbol.for('message')]: info[Symbol.for('message')] || info.message
        });

        if (stack) info.stack = info.stack;
        return info;
    }

    if (!(info.err instanceof Error)) return info;

    const err = info.err;
    Object.assign(info, err);
    if (!info.message || overrideMessage) {
        info.message = err.message;
        info[Symbol.for('message')] = err.message;
    }

    if (stack) info.stack = err.stack;
    return info;
})