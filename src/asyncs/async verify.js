


async function verifyLink(link, urlParameterObject, qualifyAllValues) {
    //link - web address link such as https://example.com/
    //urlParameterObject - Object keys - parameter names for url
    //urlParameterObject - Object values - parameter values to check if url includes
    //
  
  
    const fullLinkVerifyObject = {};
    let isValid;
  
    try {
  
      for (const [key, value] of Object.entries(urlParameterObject)) {
          
        if(Array.isArray(value)){
          if(qualifyAllValues){
            fullLinkVerifyObject[key] = value.every(cu => link.includes(cu))
          }else{
            for(let arrValue of value){
              fullLinkVerifyObject[arrValue] = link.includes(value);
            }
          }
        }
        
        if(typeof value == "object"){
          if(qualifyAllValues){
            fullLinkVerifyObject[key] = Object.values(value).every(cu => link.includes(cu))
          }else{
            for (const [innerKey, innerValue] of Object.entries(value)) {
              fullLinkVerifyObject[`${key} ${innerKey}`] = link.includes(innerValue);
            }
          }
        }
  
        fullLinkVerifyObject[key] = link.includes(value);
      }
  
      isValid = Object.values(fullLinkVerifyObject).every(cu => cu);
  
      if (!isValid) {
        logger(`Link failed due to: ${JSON.stringify(failed_url_object_check, null, 2)}`);
      }
  
    } catch (error) {
      console.error('Failed to verify link:', link, error);
      isValid = false
    }
  
    return isValid;
}

let functions = {
    verifyLink
}
  
module.exports = {
    ...functions
};