/**
 * @module "Logger" class (abstract)
 * @description Logs application messages as text
 * @version 0.0.1 (2021-02-17)
 */

require("./javaScript");

/*abstract*/ class Logger {
    get width() { return this.mWidth; }
    
    constructor(pWidth) {
        this.mWidth = Number.default(pWidth, 80);
    }

    newLine() {
        this.writeText();
    }

    writeText(pText, pIndentation) {
        const indentation = Number.default(pIndentation);
        const indentationText = indentation > 0 ? " ".repeat(indentation) : "";
        this.log(indentationText + (pText ? pText : ""));
    }

    writeSeparator(pIndentation) {
        const indentation = Number.default(pIndentation);
        this.writeText('-'.repeat(this.width - 1 - indentation), indentation);
    }

    writeError(pText, pIndentation) {
        this.writeText(`[ERROR] ${pText}`, pIndentation);
    }
}

module.exports = Logger;