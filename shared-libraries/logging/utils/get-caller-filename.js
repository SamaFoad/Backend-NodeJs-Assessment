module.exports = function getCallerFilename(errorWithStack) {
    let originalFunc = Error.prepareStackTrace;

    let callerFile;
    try {
        let currentFile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentFile = errorWithStack.stack.shift().getFileName();

        while (errorWithStack.stack.length) {
            callerFile = errorWithStack.stack.shift().getFileName();
            if (currentFile !== callerFile) break;
        }
    } catch (e) { }

    Error.prepareStackTrace = originalFunc;

    return callerFile;
}