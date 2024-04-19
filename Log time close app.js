// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-brown; icon-glyph: magic;

function getFilePath(file_name) {
    let fm = FileManager.iCloud()
    let dirPath = fm.documentsDirectory()
    return fm.joinPath(dirPath, file_name)
}

// Function to save times to file. APPPEND FILE_NAME IN FUNCTION AND
function saveStuffToFile(path1,time) {
    let fm = FileManager.iCloud()
    let file_name = path1
    fm.writeString(getFilePath(file_name), JSON.stringify(time));
}

//Get the date and time now
const nowDate = new Date();

//Find the date and time when the app was opened
let fm = FileManager.iCloud()
let path = getFilePath("dateStuff.json")
let earlierDate = fm.readString(path)

const jasonData = JSON.parse(earlierDate)
earlierDate = jasonData.date

//make the time of the opening of the app date-object
earlierDate = new Date(earlierDate)

//Get time difference between dates
const timeDifference = nowDate.getTime() - earlierDate.getTime();

//Get in seconds and round
const timeInSeconds = Math.floor(timeDifference/1000)

let timeTable = {
    shameTime: [{
        date: nowDate,
        TimeSpend: timeInSeconds,
    }],
};

//Read in ealier data
path = getFilePath("TimeTable.json")
let existingTimes = fm.readString(path)

if (!existingTimes) {
    // If the file doesn't exist or is empty, initialize existingTimes as an empty object
    saveStuffToFile("TimeTable.json", timeTable);
} else {
    // If the file exists and is not empty, parse the JSON data into a JavaScript object
    existingTimes = JSON.parse(existingTimes);
    existingTimes.shameTime.push(timeTable.shameTime[0]); // Push only the new data, not the whole timeTable
    saveStuffToFile("TimeTable.json", existingTimes);
}
console.log('All good')
Script.complete()