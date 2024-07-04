const fsp = require('fs').promises; // Use fs promises API for async operations
const fs = require('fs');
const path = require('node:path'); 

function getDateString() {
    const date = new Date();
    return date.toLocaleDateString(); // Format the date as a string
}

function getHourMinuteString() {
    const date = new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format the time as hour:minute
}

async function async_log_writer({
    path_to_log_file = "log.txt", 
    param_string_content = "Nothing entered", 
    use_seperator = "",
    appendToFile = true,
    writeToFile = false,
    use_current_time_in_log = true,
    use_current_date_in_log = true,
} = {}) {
    let content = "";
    content += use_current_date_in_log ? getDateString() + " " : "";
    content += use_current_time_in_log ? getHourMinuteString() + " " : "";

    if (typeof param_string_content === "string") {
        content += use_seperator ? use_seperator.repeat(10) + `\n${param_string_content}\n` + use_seperator.repeat(10) : param_string_content;
    } else {
        try {
            content += "\n" + JSON.stringify(param_string_content, null, 2) + "\n";
        } catch (error) {
            console.error("async_log_writer - stringify failed", error);
        }
    }

    const file = Array.isArray(path_to_log_file) ? path.join(...path_to_log_file) : path_to_log_file;

    if (content) {
        console.log(content);
        try {
            if (appendToFile) {
                await fsp.appendFile(file, `${content}\n`);
            }
            if (writeToFile) {
                await fsp.writeFile(file, `${content}\n`);
            }
        } catch (writeError) {
            console.error('Failed to write due to:', writeError, `With filename: ${file}`);
            throw writeError;
        }
    }
}

function log_writer({
    path_to_log_file = "log.txt", 
    param_string_content = "Nothing entered", 
    use_seperator = "",
    appendToFile = true,
    writeToFile = false,
    use_current_time_in_log = true,
    use_current_date_in_log = true,
} = {}) {
    let content = "";
    content += use_current_date_in_log ? getDateString() + " " : "";
    content += use_current_time_in_log ? getHourMinuteString() + " " : "";

    if (typeof param_string_content === "string") {
        content += use_seperator ? use_seperator.repeat(10) + `\n${param_string_content}\n` + use_seperator.repeat(10) : param_string_content;
    } else {
        try {
            content += "\n" + JSON.stringify(param_string_content, null, 2) + "\n";
        } catch (error) {
            console.error("log_writer - stringify failed", error);
        }
    }

    const file = Array.isArray(path_to_log_file) ? path.join(...path_to_log_file) : path_to_log_file;
    console.log(content);

    try {
        if (appendToFile) {
            fs.appendFileSync(file, `${content}\n`);
        }
        if (writeToFile) {
            fs.writeFileSync(file, `${content}\n`);
        }
    } catch (writeError) {
        console.error('Failed to write due to:', writeError, `With filename: ${file}`);
        throw writeError;
    }
}

async function async_pre_check_log(param) {
    if (typeof param === "string") {
        await async_log_writer({ param_string_content: param });
    } else {
        await async_log_writer(param);
    }
}

function pre_check_log(param) {
    if (typeof param === "string") {
        log_writer({ param_string_content: param });
    } else if (typeof param === "object") {
        log_writer(param);
    }
}

module.exports = {
    log_writer,
    async_log_writer,
    pre_check_log,
    async_pre_check_log
};
