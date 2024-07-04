const path = require('node:path'); 
const fs = require('fs').promises; // Use fs promises API for async operations
const log = require("../logger.js");
const pt = require("./async path transform.js")

let logger = log.async_pre_check_log;

async function writerAsync(fileNameOrPath, outputData) {
    let pathToFile = Array.isArray(fileNameOrPath)? 
    await pt.transformPathJoinToFullPathAsync(fileNameOrPath) : fileNameOrPath
    //Remove logger if needed
    await logger(`Writing file: ${pathToFile}`, "Method asyncs - async writer - writerAsync");


    try {
        await fs.writeFile(pathToFile, JSON.stringify(outputData));
        await logger(`Wrote to file ${pathToFile} successfully`);
        return true
    } catch (writeError) {
        await logger(`Wrote to file ${pathToFile} failed`, 'Failed to write due to:', writeError, `With filename: ${pathToFile}`);
        return false
    }
}



async function writeObjectOfArraysOrSetsAsync(site, objArrays, arrayOfPathsToFilePath) {
    await logger(`\nWriting files async_writeObjectOfArraysOrSets\n`);
    for (const [key, value] of Object.entries(objArrays)) {
        let file = [...arrayOfPathsToFilePath, `${key} ${site}.json`]
        await logger(`file: ${JSON.stringify(file, null, 2)}\n`);
        //log path, filename, and what type of output
        let fileAppended = await writerAsync(file, Array.from(value));
        await logger(`file appended: ${fileAppended}\n`)
    }

    await logger("Exiting async_writeObjectOfArraysOrSets");
}

let functions = {
    writeObjectOfArraysOrSetsAsync,
    writerAsync
}
  
module.exports = {
    ...functions
};
