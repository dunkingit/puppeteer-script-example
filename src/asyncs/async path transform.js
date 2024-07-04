const path = require('node:path'); 

async function transformPathJoinToFullPathAsync(arrayOfPathsToFilePath, filename, return_closest_folder) {
    let pathToFile;
  
    if (filename) {
        if (arrayOfPathsToFilePath) {
            if(return_closest_folder){
              pathToFile = arrayOfPathsToFilePath.includes(filename) ? 
            await path.join(...arrayOfPathsToFilePath.filter(cu => !cu.includes(filename))) : 
            await path.join(...arrayOfPathsToFilePath);
            }else{
              pathToFile = arrayOfPathsToFilePath.includes(filename) ? 
              await path.join(...arrayOfPathsToFilePath) : 
              await path.join(...arrayOfPathsToFilePath, filename);
            }
        } else {
            pathToFile = filename;
        }
    } 
      
    if(!filename){
      if(arrayOfPathsToFilePath) {
        if(return_closest_folder){
          pathToFile = await path.join(...arrayOfPathsToFilePath.filter(cu => cu.includes(".")))
        }else{
          pathToFile = await path.join(...arrayOfPathsToFilePath);
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
  transformPathJoinToFullPathAsync
}

module.exports = {
    ...functions
};