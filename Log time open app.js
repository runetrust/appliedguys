// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;
// this script aims to write to an existing file


function getFilePath() {
    let fm = FileManager.iCloud()
    let dirPath = fm.documentsDirectory()
    return fm.joinPath(dirPath, "dateStuff.json")
}

// Function to save text to file
function saveStuffToFile(text) {
    let fm = FileManager.iCloud()
    fm.writeString(getFilePath(), JSON.stringify(text));
}

const dateAndTime = {
    date: new Date(),
}

saveStuffToFile(dateAndTime)

Script.complete()
