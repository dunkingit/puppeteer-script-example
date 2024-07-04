const { time } = require("console")

function splitViewBetweenText(param, divider, times){
    let text =  divider.repeat(times) + `\n${param}\n` + divider.repeat(times)
    console.log(text)
}

// splitViewBetweenText("Hello World", "-", 20)

function outputCurrentLinkAndArray(link, set_view, set_name){
    console.log(`visiting: ${link}`)
    console.log(`${set_name} length: ${set_view.size}`)
}



module.exports = {
    splitViewBetweenText,
    outputCurrentLinkAndArray
}

