const fs = require('fs');// Use fs promises API for async operations
const fsp = require('fs').promises
const log = require("../logger.js");

let logger = log.pre_check_log

function writer({arrayOfPathsToFilePath, filename, outputData, appendToFile = false, writeToFile = true}) {
    let content;
  
    if (typeof outputData === "string") {
        content = outputData;
    } else {
        content = JSON.stringify(outputData, null, 2);
    }
    let file;
  
  
    if(arrayOfPathsToFilePath){
      file = transformPathJoinToFullPath(arrayOfPathsToFilePath, filename);
    }else{
      file = filename
    }
  
    try {
        logger(`writer method\n${file}\ncontent:${outputData}`)
  
        if (appendToFile) {
            fs.appendFileSync(file, content);
        }
        if (writeToFile) {
            fs.writeFileSync(file, content);
        }
    } catch (writeError) {
        console.error('Failed to write due to:', writeError, `With filename: ${file}`);
        throw writeError;
    }
  }



function writeNewJsonFile(pathToFile) {
try {
    fs.writeFileSync(pathToFile, JSON.stringify([]), 'utf8');
    logger('Created new file with an empty array.');
} catch (writeError) {
    logger(`Failed to create new file: ${writeError.message}`);
    throw writeError;
    }
}



function writeDirectory(dirPathString) {
logger(`Writing directory: ${dirPathString}`);
try {
    fs.mkdirSync(dirPathString, { recursive: true });
    logger("Path created successfully");
} catch (err) {
    throw new Error(`Error creating directory: ${err.message}`);
}
}


function writeObjectOfArrays(site, objectOfArrays) {
    const pathToFolder = config.pathToSiteFolder;
    for (const [key, value] of Object.entries(objectOfArrays)) {
        let file = `${key} ${site}.json`;
        writer(pathToFolder, file, value);
    }
}


let functions = {
    writeObjectOfArrays,
    writer,
    writeDirectory,
    writeNewJsonFile
    }
    
module.exports = {
    ...functions
  };
  