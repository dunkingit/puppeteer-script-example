async function getObjectAllValuesLength(obj) {
    let newObject = {};
    for (const [key, value] of Object.entries(obj)) {
        newObject[key] = Array.isArray(value) ? value.length : value.size;
    }
    return newObject;
}


async function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }



async function iterObjectFindTheDifference(oldObject, newObject) {
try {
    const differenceObject = {};
    for (const [key, value] of Object.entries(oldObject)) {
    if (typeof value === 'number') {
        const newValue = newObject[key] - oldObject[key];
        if (newValue > 0) {
        differenceObject[key] = newValue;
        }
    }
    }
    return differenceObject;
} catch (err) {
    console.error(err);
    return {};
}
}


let functions = {
    getObjectAllValuesLength,
    delay,
    iterObjectFindTheDifference
}

module.exports = {
    ...functions
};