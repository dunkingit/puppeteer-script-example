const log = require("../logger.js");

let logger = log.pre_check_log
  
function getObjectValuesLength(obj){
  if(obj){
    let newObject = {}
    for (const [key, value] of Object.entries(obj)) {
      newObject[key] = Array.isArray(value)? value.length:value.size
    }
    return newObject
  }
}


function transformObjectOfArrays_Into_ObjectOfSets(obj) {
  let newObject = {};
  
  for (const [key, value] of Object.entries(obj)) {
    newObject[key] = new Set(value);
  }
  
  return newObject;
}


let functions = {
  transformObjectOfArrays_Into_ObjectOfSets,
  getObjectValuesLength
}

module.exports = {
  ...functions
};