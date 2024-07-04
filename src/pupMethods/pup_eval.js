const puppeteer = require("puppeteer");
const log = require("../logger.js");

let logger = log.log_writer

async function puppetEvalSpecail_wholePageObject(page){
    return await page.evaluate(() => {
     return window._initialData
    })
  }

async function puppetEvalSpecial_siteSpecific(page) {
    const collectedData = await page.evaluate(() => {
        function arrayObjsListOfObject(param){
        return param.map(cu => cu['label']).filter(cu => cu)
        } 
        
        function placekeyvalueintoobject(param_obj, addToObj){
        for (const [key, value] of Object.entries(param_obj)){
            if(value && !Array.isArray(value) && typeof value == 'object'){
            if(value){placekeyvalueintoobject(value, addToObj)}
            }
            addToObj[key] = value
        };
        }
        
        function convertdate(param_obj){
            for (const [key, value] of Object.entries(param_obj)){
            if(key.includes('date')){
                const datetime = new Date(value);
                const splitDateTime = datetime.toLocaleString().split(", ")
                const date = splitDateTime[0]
                const time = splitDateTime[1]
                param_obj[`${key} date`] = date
                param_obj[`${key} time`] = time
            }
            };
        }

        function convertDateTime(param_obj){
                const datetime = new Date(value);
                const splitDateTime = datetime.toLocaleString().split(", ")
                const date = splitDateTime[0]
                const time = splitDateTime[1]
                param_obj[`${key} date`] = date
                param_obj[`${key} time`] = time
            };
        
        
        
        function main(){
        let obj = {}
        try{
        let salary = window._initialData['salaryInfoModel']
        placekeyvalueintoobject(salary, obj)
        }catch(err){
        console.log(`Problem with ${window.location.href}\n`)
        }
        
        obj['about job posting - link'] =  window.location.href
        let mainobj = window._initialData["hostQueryExecutionResult"]['data']['jobData']['results'][0]['job']
        
        let needed = ["title","sourceEmployerName", "url", "datePublished", "expired","normalizedTitle","dateOnIndeed","isHighQualityMarketplaceMatch"]
        let arrayOfObjsLabel = ["jobTypes","benefits", "shiftAndSchedule", "attributes", "occupations"]  //labels
        
        try{
        let rate = mainobj['employer']["ugcStats"]['ratings']["overallRating"]
        let name = rate["__typename"]
        let count = rate['count']
        obj[`${name}_count`] = count
        obj[`${name}_ratingOfEmployer`] = rate['value']
        }catch(err){}
        
        for(let text of needed){
        obj[text] = mainobj[text]
        }
        
        
        let objects = ["description", "location", "hiringDemand", "employer"]  
        for(let text of objects){
        try{
            let keys = Object.keys(mainobj[text])
            if(typeof keys != "undefined"){
            for(let other of keys){
                let newname = `${text}_${other}`
                let item = mainobj[text][other]
                if(item){
                if(typeof item == 'object'){
                    for (const [key, value] of Object.entries(item)) {
                    obj[`${newname}_${key}`] = value}
                }else{
                    obj[newname] = mainobj[text][other] 
                }}}}
        }catch(err){}
        }
        
        for(let each of arrayOfObjsLabel){
            let temper = mainobj[each]
            if(temper.length > 0){
            let x = arrayObjsListOfObject(temper)
            obj[each] = x
            }}
        convertdate(obj)
        return obj
        }
        return main()
    })//End of evail  
    return collectedData
}
  ////////////////////////////////////////////////////////////
  //End of eval function
  ////////////////////////////////////////////////////////////
  
async function evalSpecialPagination(page) {
let paginationLinks = []

let pagination = await page.evaluate(() => {
return Array.from(document.getElementsByClassName("css-163rxa6 e8ju0x50")).map(cu => cu.href).filter(cu => cu) || []
})
paginationLinks.push(...pagination)
console.table(paginationLinks)
console.log(`pagination length: ${paginationLinks.length}`)
return paginationLinks 
}

  
async function get_all_href_by_qall(page) {
    return await page.evaluate(() => {
    return Array.from(document.querySelectorAll("*")).map(cu => cu.href).filter(cu => cu)
})}


async function check_valid_page_no_captcha(page){
    return await page.evaluate(() => {
        try{
        return document.querySelector("#challenge-running").textContent.includes("Verify you are human")
        }catch(err){
        return false
        }
    })
}

async function getJobLinksOnPage(page, url) {
    const allLinks = await get_all_href_by_qall(page);
    return allLinks.filter(cu => cu && cu.includes("/rc/"))
}


module.exports = {
    eval_special_whole: puppetEvalSpecail_wholePageObject,
    eval_special: puppetEvalSpecial_siteSpecific,
    evalSpecialPagination,
    get_all_href_by_qall,
    check_valid_page_no_captcha,
    getJobLinksOnPage
}