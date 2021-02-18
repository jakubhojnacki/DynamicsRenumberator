/**
 * @module "ConsoleLogger" class
 * @description Logs application messages to a console
 * @version 0.0.1 (2021-02-17)
 */

const LoggerType = require("./loggerType");
const TextLogger = require("./logger");
require("./javaScript");

class ConsoleLogger extends TextLogger {
    get type() { return LoggerType.console; }

    constructor(pWidth) {
        super(pWidth);
    }

    log(pText) {
        console.log(pText);
    }

    dispose() {
    }
}

module.exports = ConsoleLogger;