const fs = require('fs');
const log = require("../logger.js");

let logger = log.pre_check_log


function readParseJsonSync(file) {
    try {
        const fileContent = fs.readFileSync(file, 'utf8');

        logger(`Loaded successfully: ${file}`);

        return JSON.parse(fileContent);
    } catch (error) {
        const errorMessage = `Read or parse error - function - readParseJsonSync:\n${error.message}\nWith filename: ${file}`;
        logger(`Failed: ${file}\n${errorMessage}`);
        if (error.code === 'ENOENT') {
            logger('File not found.')

        } else {
            logger('Error parsing JSON. Resetting file with an empty array.');
        }

        return false;

    }
}

let functions = {
    readParseJsonSync

}

module.exports = {
    ...functions
}
