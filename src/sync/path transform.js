const path = require('node:path'); 
const log = require("../logger.js");

let logger = log.pre_check_log


function transformPathJoinToFullPath(arrayOfPathsToFilePath, filename, return_closest_folder, use_verify) {
    let pathToFile;
  
    if (filename) {
        if (arrayOfPathsToFilePath) {
            if(return_closest_folder){
              pathToFile = arrayOfPathsToFilePath.includes(filename) ? 
              path.join(...arrayOfPathsToFilePath.filter(cu => !cu.includes(filename))) : 
              path.join(...arrayOfPathsToFilePath);
            }else{
              pathToFile = arrayOfPathsToFilePath.includes(filename) ? 
              path.join(...arrayOfPathsToFilePath) : 
              path.join(...arrayOfPathsToFilePath, filename);
            }
        } else {
            pathToFile = filename;
        }
    } 
      
    if(!filename){
      if(arrayOfPathsToFilePath) {
        if(return_closest_folder){
          pathToFile = path.join(...arrayOfPathsToFilePath.filter(cu => !cu.includes(".")))
        }else{
          pathToFile = path.join(...arrayOfPathsToFilePath);
        }
      }
    }
  
    if (!pathToFile) {
        console.error('No valid path or file provided');
        return false;
    }
  
    return pathToFile;
  }

let functions = {
transformPathJoinToFullPath
}
  
module.exports = {
    ...functions
};
