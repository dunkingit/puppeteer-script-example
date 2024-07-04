const path = require('node:path'); 
const fs = require('fs').promises; // Use fs promises API for async operations
const log = require("../logger.js");

let logger = log.async_pre_check_log;

async function getObjectAllValuesLength(obj) {
    let newObject = {};
    for (const [key, value] of Object.entries(obj)) {
        newObject[key] = Array.isArray(value) ? value.length : value.size;
    }
    return newObject;
}



// async function transformPathJoinToFullPathAsync(arrayOfPathsToFilePath, filename, return_closest_folder) {
//   let pathToFile;

//   if (filename) {
//       if (arrayOfPathsToFilePath) {
//           if(return_closest_folder){
//             pathToFile = arrayOfPathsToFilePath.includes(filename) ? 
//           await path.join(...arrayOfPathsToFilePath.filter(cu => !cu.includes(filename))) : 
//           await path.join(...arrayOfPathsToFilePath);
//           }else{
//             pathToFile = arrayOfPathsToFilePath.includes(filename) ? 
//             await path.join(...arrayOfPathsToFilePath) : 
//             await path.join(...arrayOfPathsToFilePath, filename);
//           }
//       } else {
//           pathToFile = filename;
//       }
//   } 
    
//   if(!filename){
//     if(arrayOfPathsToFilePath) {
//       if(return_closest_folder){
//         pathToFile = await path.join(...arrayOfPathsToFilePath.filter(cu => cu.includes(".")))
//       }else{
//         pathToFile = await path.join(...arrayOfPathsToFilePath);
//       }
//     }
//   }

//   if (!pathToFile) {
//       console.error('No valid path or file provided');
//       return false;
//   }

//   return pathToFile;
// }



async function parseJsonAsync(arrayOfPathsToFilePath, filename) {
    const pathToFile = filename ? path.join(...arrayOfPathsToFilePath, filename) : path.join(...arrayOfPathsToFilePath);

    try {
        const fileContent = await fs.readFile(pathToFile, 'utf8');
        console.log('Content loaded');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Read or parse error - function - parse_json:', error.message, `With filename: ${pathToFile}`);

        if (error.code === 'ENOENT') {
            console.log('File not found. Creating a new file with an empty array.');
        } else {
            console.log('Error parsing JSON. Resetting file with an empty array.');
        }
        return false;
    }
}



async function writerAsync(arrayOfPathsToFilePath, filename, outputData) {
    const pathToFile = await transformPathJoinToFullPathAsync(arrayOfPathsToFilePath, filename);
    await logger(`Writing file: ${pathToFile}`, "async writer");
    try {
        await fs.writeFile(pathToFile, JSON.stringify(outputData));
    } catch (writeError) {
        console.error('Failed to write due to:', writeError, `With filename: ${pathToFile}`);
        throw writeError;
    }
}



async function writeObjectOfArraysOrSetsAsync(site, objArrays, path) {
    const pathToFolder = path
    await logger(`\nWriting files async_writeObjectOfArraysOrSets\n`);
    for (const [key, value] of Object.entries(objArrays)) {
        let file = `${key} ${site}.json`;
        await logger(`path:${pathToFolder}\nfile: ${file}\ntype of value: ${typeof value}`);
        await writerAsync(pathToFolder, file, Array.from(value));
    }
    console.log("Exiting async_writeObjectOfArraysOrSets");
}



module.exports = {
    async_writeObjectOfArraysOrSets: writeObjectOfArraysOrSetsAsync,
    async_writer: writerAsync,
    get_object_values_len: getObjectAllValuesLength
};
