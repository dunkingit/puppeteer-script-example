

async function parseJsonAsync(arrayOfPathsToFilePath, filename) {
    let pathToFile = Array.isArray(fileNameOrPath)? 
    await transformPathJoinToFullPathAsync(fileNameOrPath) : fileNameOrPath

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



let functions = {
    parseJsonAsync
}

module.exports = {
    ...functions
};