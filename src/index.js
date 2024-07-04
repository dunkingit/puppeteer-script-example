const puppeteer = require("puppeteer");
const ag = require("./asyncs/async gen.js");
const aw = require("./asyncs/async writer.js");
const av = require("./asyncs/async verify.js");
const pup = require("./pupMethods/pup.js");
const pup_eval = require("./pupMethods/pup_eval.js");
const log = require("./logger.js");
const reader = require("./sync/reader.js")
const gen = require("./sync/general methods.js")
const v = require("./sync/verify.js")
const pt = require("./sync/path transform.js")
const w = require("./sync/writer.js")
const pl = require("./sync/platform.js")
const os = require("os");



let logger = log.pre_check_log

logger(pl.infoAboutMachine)

let config = reader.readParseJsonSync("./config.json")
let urlParameters = reader.readParseJsonSync("../files/url parameters.json");



let site = config.site
let files = config.fileNames;


let arrayOfPathsToFilePath = [...os.homedir().split("\\"), ...config.pathToSiteFolder]
arrayOfPathsToFilePath.push(site)
logger(arrayOfPathsToFilePath)



let isValidPath = v.verifyArrayPathIsCorrect(arrayOfPathsToFilePath, pl.infoAboutMachine["platform name"], true);
if (!isValidPath) {
    throw new Error(`Invalid path array for file.`);
}
logger(isValidPath)


const pathToFolder = pt.transformPathJoinToFullPath(arrayOfPathsToFilePath);
config["pathToFolder"] = pathToFolder

logger(pathToFolder)

let pathsExist = v.verifyAllPathsToFilePath(arrayOfPathsToFilePath, false);
if (!pathsExist) {
  w.writeDirectory(pathToFolder);
}

logger(pathsExist)

pathsExist = v.verifyAllPathsToFilePath(arrayOfPathsToFilePath, true);
if (!pathsExist) {
    throw new Error(`Paths do not exist.`);
}

let objectOfArrays = {};
for (let action of files) {
    let filename = `${action} ${site}.json`;
    const pathToFile = pt.transformPathJoinToFullPath(arrayOfPathsToFilePath, filename);

    logger(`Path to file: ${pathToFile}\n\n\nFilename: ${filename}`);

    let jsonContent = reader.readParseJsonSync(pathToFile);

    if (!jsonContent) {
      w.writeNewJsonFile(pathToFile);
      jsonContent = [];
    }
    objectOfArrays[action] = jsonContent;
}


function readZipCodesFileReturnZipCodesArray() {
  return reader.readParseJsonSync("../files/zipCodes.json");
}



function getSearchTerms() {
  const terms = [];
  const zips = readZipCodesFileReturnZipCodesArray().map(cu => `l=${cu}&radius=10`);
  const searchTerms = config.searchTerms;
  
  for (let term of searchTerms) {
    terms.push(...zips.map(cu => `${term}&${cu}`));
  }
  
  return terms;
}


function generateSearchURLs({ netloc, subDirectory = 'jobs?', schema = 'https://', queryBase = 'q=' }, searchTerms) {
  return searchTerms.map(term => `${schema}${netloc}/${subDirectory}${queryBase}${term}`);
}


function generatedSearchUrls(siteNetloc) {
  let toVisit = generateSearchURLs({ netloc: siteNetloc }, getSearchTerms());
  let checkVisit = new Set(objectOfArrays.visited_links)
  let toVisitLinksFiltered = toVisit.filter(cu => cu && cu.length > 0 && !checkVisit.has(cu));
  objectOfArrays["visit_links"] = toVisitLinksFiltered;
  console.log(objectOfArrays)
}

generatedSearchUrls(config.netloc)

let objectOfSets = gen.transformObjectOfArrays_Into_ObjectOfSets(objectOfArrays);


async function searchSiteForJobLinks() {
  logger = log.async_pre_check_log

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await logger("Started Browser");

  const localConfig = {
    array_index_counter: 0,
    captcha_counter: 0,
    wait_time_in_ms: 0,
  };

  for (const link of objectOfSets.visit_links) {
    try {

      localConfig.link = link;
      await logger(link)

      if (objectOfSets.visited_links.has(link)) {
        await logger(`Already visited\n\n`);
        localConfig.array_index_counter++;
        continue;
      }


      if (!await av.verifyLink(link, urlParameters)) {
        await logger(`verify link failed\n\n`);
        localConfig.array_index_counter++;
        continue;
      }



      const opened_link = await pup.navigateTo(page, link, 3, localConfig.wait_time_in_ms);
      await logger(`opened link is: ${opened_link}`);
      
      if (!opened_link) {
        await logger(`puppet could not open link\n\n`);
        localConfig.array_index_counter++;
        objectOfSets.failed_links.add(link);
        continue;
      }



      const checkForCaptcha = await pup_eval.check_valid_page_no_captcha(page);
      if (checkForCaptcha) {
        await logger(`"captcha link, please revisit later"`);
        localConfig.captcha_counter++;
        objectOfSets.captcha_links.add(link);
        continue;
      }



      const jobs = await pup_eval.getJobLinksOnPage(page, link);
      if (jobs.length === 0) {
        await logger("Found zero job listings, please check url later.");
        objectOfSets.not_needed.add(link);
      } else {
        await logger(`Found links: ${jobs.length}`);
        jobs.forEach(cu => objectOfSets.job_links.add(cu));
      }



      const paginationLinks = await pup_eval.evalSpecialPagination(page);
      if (paginationLinks) {
        paginationLinks.filter(cu => cu && cu.length > 0).forEach(cu => objectOfSets.visit_links.add(cu));
      }



      if (localConfig.array_index_counter % 20 === 0 || objectOfSets.visit_links.size - 1 === localConfig.array_index_counter) {
        await logger("-".repeat(100))
        await logger(config)
        console.log(objectOfSets)
        await aw.writeObjectOfArraysOrSetsAsync(config.site, objectOfSets, arrayOfPathsToFilePath);
      }

      objectOfSets.visited_links.add(link);
      localConfig.array_index_counter++;
      await ag.delay(1000)

      if (localConfig.captcha_counter > 10) {
        await logger("Program did not regain functionality. Try again.");
        await browser.close();
        await ag.delay(10 * 60000);
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();
      }
    } catch (error) {
      console.error("Error processing link:", link, error);
      await logger(`Error processing link: ${link}\n${error.message}`);
    }
  }

  await browser.close();
}

searchSiteForJobLinks().catch(error => console.error("Error in searchSiteForJobLinks:", error));