const puppeteer = require("puppeteer");
const log = require("../logger.js");

let logger = log.async_pre_check_log

async function delay(time) {
    return await new Promise(function(resolve) {
      setTimeout(resolve, time);
    });
  }


async function navigateTo(page, link, retries = 3, wait = 1000){
    try {
        await page.goto(link, { waitUntil: 'networkidle0', timeout: wait});
        await logger({param_string_content:`Connected to link successfully`})
        return true
    }catch(err){
        let logToObject = {
            link, err, retries, wait
        }
        await logger({param_string_content:`Puppeteer failed\n${JSON.stringify(logToObject, null, 2)}`})
        if(retries === 0){
            return false
        }
        await delay(wait * 2)
        return navigateTo(page, link, retries -1, wait * 2)
    }
}

module.exports = {
    navigateTo
 };