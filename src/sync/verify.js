const path = require('node:path'); 
const fs = require('fs');// Use fs promises API for async operations

const log = require("../logger.js");

let logger = log.pre_check_log

function verifyArrayPathIsCorrect(arrayOfPathsToFilePath, platformName, view) {
    // const linuxMacPath = path.join('/', 'home', 'username', 'Documents');

    const parametersToCheckObject = {
    "is true": arrayOfPathsToFilePath,
    "is array": Array.isArray(arrayOfPathsToFilePath),
    "is longer than 0": arrayOfPathsToFilePath.length !== 0,
    "first element in array depending upon platform": 
    platformName == "windows"? /[A-Z]:/.test(arrayOfPathsToFilePath[0]):/\//.test(arrayOfPathsToFilePath[0])
};
  
    const checkAllParameters = Object.values(parametersToCheckObject).every(cu => cu);
    let failedParameters = {}
  
  
    if (!checkAllParameters) {
        failedParameters = Object.entries(parametersToCheckObject)
            .filter(([key, value]) => !value)
            .map(([key]) => key);
    }
  
  
    if (view) {
      console.table(parametersToCheckObject);
      console.table(failedParameters);
      logger(`No valid path or file provided\nFailed due to reasons: ${JSON.stringify(failedParameters, null, 2)}`);
  }
    return checkAllParameters;
  }
  
  
  
  function verifyAllPathsToFilePath(arrayOfPathsToFilePath, view = false) {
    if (!view) {
        return arrayOfPathsToFilePath.every((cu, ind) => fs.existsSync(path.join(...arrayOfPathsToFilePath.slice(0, ind + 1))))
    }else{
  
        
    const directoryPathsToFileObject = {};
    const arrayOfCurrentPath = [];
    
  
    for (let eachPath of arrayOfPathsToFilePath) {
        arrayOfCurrentPath.push(eachPath);
        const pathToVerify = path.join(...arrayOfCurrentPath);
        directoryPathsToFileObject[pathToVerify] = fs.existsSync(pathToVerify);
  
    }
  
  
    // logger(`Directories are verified: ${directoriesAreVerified}`);
    // logger(JSON.stringify(directoriesVerifiedObject, null, 2));
  
  
    console.table(directoryPathsToFileObject);
    return directoryPathsToFileObject;
    }
  }


let functions = {
    verifyArrayPathIsCorrect,
    verifyAllPathsToFilePath
}
  
  module.exports = {
    ...functions
  };
  


    // const parametersToCheckObject = {
//     "arrayOfPathsToFilePath": arrayOfPathsToFilePath,
//     "Array.isArray(arrayOfPathsToFilePath)": Array.isArray(arrayOfPathsToFilePath),
//     "arrayOfPathsToFilePath.length !== 0": arrayOfPathsToFilePath.length !== 0,
//     "arrayOfPathsToFilePath[0].search(/[A-Z]:/)": arrayOfPathsToFilePath[0]?.search(/[A-Z]:/) !== -1,
// };