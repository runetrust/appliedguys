// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: magic;

//function to get file path for the data on screentime
function getFilePath(file_name) {
    let fm = FileManager.iCloud();
    let dirPath = fm.documentsDirectory();
    return fm.joinPath(dirPath, file_name);
};

let fm = FileManager.iCloud(); //even if the file isn't stored locally, we can still access it
let path = getFilePath("TimeTable.json");
let timeInfo = fm.readString(path); //read the data from the file
const data = JSON.parse(timeInfo); //parse it as a jSON-file

const now = new Date(); // Get current timestamp

// Initialize variable for time spent in the last 24 hours
let timeSpentLast24Hours = 0;

// Iterate over the shameTime array
data.shameTime.forEach(entry => {
    const entryDate = new Date(entry.date);
    const timeSpend = entry.TimeSpend;

    // Check if the entry is within the last 24 hours
    if (now - entryDate < 24 * 60 * 60 * 1000) {
        timeSpentLast24Hours += timeSpend;
    }
});

timeSpentLast24Hours = timeSpentLast24Hours/60/60 //cange unit from second to hours
timeSpentLast24Hours = timeSpentLast24Hours.toFixed(1) //only one decimal

//function for making notfication
function notificationMaker(){
    notif = new Notification();
    notif.identifier = "ShameTime";
    notif.title = `!ShameTime! Overview for the day`;
    notif.height = 60
    notif.body = `Click here for your overview`;
    notif.sound = 'event';
    notif.openURL = URLScheme.forRunningScript();
    notif.scriptName = Script.name();
    notif.threadIdentifier = 'ShameTime';
}

//function for calculating percentage of a book read by number of pages and time spend. Underlying assumption is 1.7 min pr page
function percentageMaker(timespent, pages){
    let percentRead = (timespent / ((pages * 1.7) / 60)) * 100;
    percentRead = percentRead.toFixed(0);
    return(percentRead)
}

//depending on the alternative activity chosen by the user, different messages are to be shown in the following UI
function textLinkGenerator(typeAlternative){
    if(typeAlternative === 'wiki'){
        const textOne = `Read this wiki page on ${firstWiki} ${percentWikiOne} times - (click here)`;
        const linkToTextOne = firstWikiLink;

        const textTwo = `Read this wiki page on ${secondWiki} ${percentWikiTwo} times - (click here)`;
        const linkToTextTwo = secondWikiLink;
        return([textOne, linkToTextOne, textTwo, linkToTextTwo])

    } else if(typeAlternative === 'books'){
        const textOne = `Read ${percentReadOne}% of ${firstBook} - (click here)`;
        const linkToTextOne = firstBookLink;

        const textTwo = `Read ${percentReadTwo}% of ${secondBook} - (click here)`;
        const linkToTextTwo = secondBookLink;
        return([textOne, linkToTextOne, textTwo, linkToTextTwo])

    } else if(typeAlternative === 'duolingo'){
        const textOne = `Done ${seriousDuolingoSessions} serious Duolingo sessions - (click here)`;
        const linkToTextOne = firstDuolingoLink;

        const textTwo = `Done ${intenseDuolingoSessions} intense Duolingo sessions - (click here)`;
        const linkToTextTwo = secondduolingoLink;
        return([textOne, linkToTextOne, textTwo, linkToTextTwo])

    } else if(typeAlternative === 'Exercise'){
        const textOne = `${activity1} ${activityLength1}km and still had ${timeToSpare1} min to spare - (click here)`;
        const linkToTextOne = activityLink1;
    
        const textTwo = `${activity2} ${activityLength2}km and still had ${timeToSpare2} min to spare - (click here)`;
        const linkToTextTwo = activityLink2;
        return([textOne, linkToTextOne, textTwo, linkToTextTwo])
    }
}

// make user interface. When choice is pressed, values to be shown in nex UI is determined
function UIMaker(timespent){
    let UI = new UITable();
    UI.showSeparators = true;

    row = new UITableRow();
    row.isHeader = true;
    row.addText(`Welcome to your ShameTime-overview for the day`);
    row.height = 60
    UI.addRow(row);
    row1 = new UITableRow();
    row1.addText(`You have lost ${timespent} hours to social media within the last 24 hours. Instead of falling into the trap of doom scrolling that the tech corporations want you to, you could have:`);
    row1.height = 150;
    UI.addRow(row1);

    row2 = new UITableRow();
    row2.dismissOnSelect = true;
    row2.onSelect = () => {
        const alternative = 'books';
        const textParametersBooks = textLinkGenerator(alternative)
        const textOne = textParametersBooks[0]
        const linkForTextOne = textParametersBooks[1]
        const textTwo = textParametersBooks[2]
        const linkForTextTwo = textParametersBooks[3]
        whenPressed(totalTime,textOne, linkForTextOne, textTwo, linkForTextTwo);
        };
    row2.addText('Read some popular books - (click here)');
    row2.height = 90;
    UI.addRow(row2);

    row3 = new UITableRow();
    row3.dismissOnSelect = true;
    row3.onSelect = () => {
        const alternative = 'wiki';
        const textParametersWiki = textLinkGenerator(alternative)
        const textOne = textParametersWiki[0]
        const linkForTextOne = textParametersWiki[1]
        const textTwo = textParametersWiki[2]
        const linkForTextTwo = textParametersWiki[3]
        whenPressed(totalTime,textOne, linkForTextOne, textTwo, linkForTextTwo);
        };
    row3.addText('Read some Wikipedia pages to expand your knowledge for the next Bezzerwizzer game - (click here)');
    row3.height = 90;
    UI.addRow(row3);
    
    row4 = new UITableRow();
    row4.dismissOnSelect = true;
    row4.onSelect = () => {
        const alternative = 'duolingo';
        const textParametersDuolingo = textLinkGenerator(alternative)
        const textOne = textParametersDuolingo[0]
        const linkForTextOne = textParametersDuolingo[1]
        const textTwo = textParametersDuolingo[2]
        const linkForTextTwo = textParametersDuolingo[3]
        whenPressed(totalTime,textOne, linkForTextOne, textTwo, linkForTextTwo);
        };
    row4.addText('Prepared your vocabulary for traveling the world - (click here)');
    row4.height = 90;
    UI.addRow(row4);
    
    row5 = new UITableRow();
    row5.dismissOnSelect = true;
    row5.onSelect = () => {
        const alternative = 'Exercise';
        const textParametersExercises = textLinkGenerator(alternative)
        const textOne = textParametersExercises[0]
        const linkForTextOne = textParametersExercises[1]
        const textTwo = textParametersExercises[2]
        const linkForTextTwo = textParametersExercises[3]
        whenPressed(totalTime,textOne, linkForTextOne, textTwo, linkForTextTwo);
    };
    row5.addText('Improved your physical and mental well-being - (click here)');
    row5.height = 90;
    UI.addRow(row5);
    UI.present();
}

//UI to be presented when choice of alternative activity has been made
function whenPressed(timespent,textRow1, link1, textRow2, link2){

    UI = new UITable();
    UI.showSeparators = true;
    row = new UITableRow();
    row.isHeader = true;
    row.addText(`Instead of having spent ${timespent} hours on SoMe for the past 24 hours, you could have:`);
    row.height = 90
    UI.addRow(row);

    row1 = new UITableRow();
    row1.dismissOnSelect = true;
    row1.onSelect = () => {
    Safari.open(link1);
    };
    row1.addText(textRow1);
    row1.height = 90;
    UI.addRow(row1);

    row2 = new UITableRow();
    row2.dismissOnSelect = true;
    row2.onSelect = () => {
    Safari.open(link2);
    };
    row2.addText(textRow2);
    row2.height = 90;
    UI.addRow(row2);
    UI.present();
}

//Depending on the time spend, different activity parameters will make sense. 
//This function defines what physical activities is being shown to the user depending on the value of time spend
function activityParameters(timeSpent){
    
    if (timeSpent >= 25 / 60 && timeSpent <= 49/60) {
        const activityOne = 'Ran';
        const activityLengthOne = 5;
        const timeToSpareOne = timeSpent*60-25 //assuming 5k takes 25 min

        const activityTwo ='Jogged';
        const activityLengthTwo = Math.floor(timeSpent*5);
        const timeToSpareTwo =((timeSpent*5)%1)*60;
        return([activityOne, activityLengthOne, timeToSpareOne, activityTwo, activityLengthTwo, timeToSpareTwo])

    } else if (timeSpent >= 55 / 60 && timeSpent <= 109/60){

        const activityOne = 'Ran';
        const activityLengthOne = 10;
        const timeToSpareOne = timeSpent*60-55 //assuming 10k takes 55 min

        const activityTwo ='Cycled';
        const activityLengthTwo = Math.floor(timeSpent*15); //assuming average cycling pace is 15 km/h
        const timeToSpareTwo = ((timeSpent*15)%1)*60;
        return([activityOne, activityLengthOne, timeToSpareOne, activityTwo, activityLengthTwo, timeToSpareTwo])

    } else if (timeSpent >= 120 / 60 && timeSpent <= 239/60){
        const activityOne = 'Ran';
        const activityLengthOne = 21.1;
        const timeToSpareOne = timeSpent*60-120 //assuming 10k takes 120 min

        const activityTwo = 'Cycled';
        const activityLengthTwo = Math.floor(timeSpent*15); //assuming average cycling pace is 15 km/h
        const timeToSpareTwo =((timeSpent*15)%1)*60;
        return([activityOne, activityLengthOne, timeToSpareOne, activityTwo, activityLengthTwo, timeToSpareTwo])

    } else{
        const activityOne = 'Jogged';
        const activityLengthOne = Math.floor(timeSpent*5); //assuming average jogging pace is 5 km/h
        const timeToSpareOne = ((timeSpent*5)%1)*60;

        const activityTwo ='Cycled';
        const activityLengthTwo = Math.floor(timeSpent*15); //assuming average cycling pace is 15 km/h
        const timeToSpareTwo =((timeSpent*15)%1)*60;
        return([activityOne, activityLengthOne, timeToSpareOne, activityTwo, activityLengthTwo, timeToSpareTwo])
    }
}

//function for random number betweeen 0 and 74 (math random cannot produce 1)
function getRandomInt() {
    return Math.floor(Math.random() * 75);
}

//base URL for google books API. Specific book is to be specified by combining this with a random book from bookOptions
const baseURL = 'https://www.googleapis.com/books/v1/volumes?q='
// Top 100 selling books in UK, 25 items get removed later as no infolink was available for these titles
let bookOptions = ['Da Vinci Code,The',
'Harry Potter and the Deathly Hallows',
"Harry Potter and the Philosopher's Stone",
'Harry Potter and the Order of the Phoenix',
'Fifty Shades of Grey',
'Harry Potter and the Goblet of Fire',
'Harry Potter and the Chamber of Secrets',
'Harry Potter and the Prisoner of Azkaban',
'Angels and Demons',
"Harry Potter and the Half-blood Prince:Children's Edition",
'Fifty Shades Darker',
'Twilight',
'Girl with the Dragon Tattoo,The:Millennium Trilogy',
'Fifty Shades Freed',
'Lost Symbol,The',
'New Moon',
'Deception Point',
'Eclipse',
'Lovely Bones,The',
'Curious Incident of the Dog in the Night-time,The',
'Digital Fortress',
'Short History of Nearly Everything,A',
'Girl Who Played with Fire,The:Millennium Trilogy',
'Breaking Dawn',
'Very Hungry Caterpillar,The:The Very Hungry Caterpillar',
'Gruffalo,The',
"Jamie's 30-Minute Meals",
'Kite Runner,The',
'One Day',
'Thousand Splendid Suns,A',
"Girl Who Kicked the Hornets' Nest,The:Millennium Trilogy",
"Time Traveler's Wife,The",
'Atonement',
"Bridget Jones's Diary:A Novel",
'World According to Clarkson,The',
"Captain Corelli's Mandolin",
'Sound of Laughter,The',
'Life of Pi',
'Billy Connolly',
'Child Called It,A',
"Gruffalo's Child,The",
"Angela's Ashes:A Memoir of a Childhood",
'Birdsong',
'Northern Lights:His Dark Materials S.',
'Labyrinth',
'Harry Potter and the Half-blood Prince',
'Help,The',
'Man and Boy',
'Memoirs of a Geisha',
"No.1 Ladies' Detective Agency,The:No.1 Ladies' Detective Agency S.",
'Island,The',
'PS, I Love You',
'You are What You Eat:The Plan That Will Change Your Life',
'Shadow of the Wind,The',
'Tales of Beedle the Bard,The',
'Broker,The',
"Dr. Atkins' New Diet Revolution:The No-hunger, Luxurious Weight Loss P",
'Subtle Knife,The:His Dark Materials S.',
'Eats, Shoots and Leaves:The Zero Tolerance Approach to Punctuation',
"Delia's How to Cook:(Bk.1)",
'Chocolat',
'Boy in the Striped Pyjamas,The',
"My Sister's Keeper",
'Amber Spyglass,The:His Dark Materials S.',
'To Kill a Mockingbird',
'Men are from Mars, Women are from Venus:A Practical Guide for Improvin',
'Dear Fatty',
'Short History of Tractors in Ukrainian,A',
'Hannibal',
'Lord of the Rings,The',
'Stupid White Men:...and Other Sorry Excuses for the State of the Natio',
'Interpretation of Murder,The',
'Sharon Osbourne Extreme:My Autobiography',
'Alchemist,The:A Fable About Following Your Dream',
"At My Mother's Knee ...:and Other Low Joints",
'Notes from a Small Island',
'Return of the Naked Chef,The',
'Bridget Jones: The Edge of Reason',
"Jamie's Italy",
'I Can Make You Thin',
'Down Under',
'Summons,The',
'Small Island',
'Nigella Express',
'Brick Lane',
"Memory Keeper's Daughter,The",
'Room on the Broom',
'About a Boy',
'My Booky Wook',
'God Delusion,The',
'"Beano" Annual,The',
'White Teeth',
'House at Riverton,The',
'Book Thief,The',
'Nights of Rain and Stars',
'Ghost,The',
'Happy Days with the Naked Chef',
'Hunger Games,The:Hunger Games Trilogy',
"Lost Boy,The:A Foster Child's Search for the Love of a Family",
"Jamie's Ministry of Food:Anyone Can Learn to Cook in 24 Hours"];

let bookOptionsReplaced = [];

let indicesToRemove = [2, 6, 7, 10, 25, 33, 34, 36, 40, 41, 54, 55, 58, 60, 63, 65, 69, 70, 78, 79, 81, 86, 90, 93, 99];

// Sort indices in descending order to prevent unintended index shifting
indicesToRemove.sort((a, b) => b - a);

// Remove books without infoLink from the array based on the indices
indicesToRemove.forEach(index => {
    bookOptionsReplaced.splice(index, 1);
});

//Adding the title and API URL together
for (let i = 0; i < bookOptions.length; i++) {
    let replacedBook = bookOptions[i].replace(/ /gi, "+");
    bookOptionsReplaced.push(baseURL+replacedBook);
}

//Function to fetch a link to a randomly specified book through google books API
async function bookFetch(){
    const googleBooks = (bookOptionsReplaced[getRandomInt()]);

    // Get book by fetching from the link assigned to googleBooks, parsed to JSON
    const response = await new Request(googleBooks)
    const bookList = await response.loadJSON()

    // find book index 0 and link to the book for second fetch. We assume the first element of the list is the one we want to show
    const randomBook = bookList.items[0].selfLink

    // request the book data and defining the title of the extracted book
    const response2 = await new Request(randomBook)
    const link = await response2.loadJSON()
    const title = link.volumeInfo.title 
    const pages = link.volumeInfo.pageCount
    const infoLink = link.volumeInfo.infoLink

    return([title, pages, infoLink])
}

//Parameters specified in order to fetch a random Wikipeadia page
const params = {
    action: "query",
    format: "json",
    list: "random",
    prop: "info",
    inprop: "url|talkid",
    rnlimit: "2", //how many articles?
    rnnamespace: 0 //Restricting to only actual pages and not "talks"
};

//Base URL for the fetch
let url = "https://en.wikipedia.org/w/api.php?origin=*"; 

//Combine base URL with parameters to get two random wikipages
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

//Function for fetching titles, links and number of characters for the two fetched wikipedia pages
async function homeMadeGet(){
    const response = await new Request(url)
    const parsedFetch = await response.loadJSON()

    let randoms = parsedFetch.query.random;
    let titles = [];
    for (r in randoms) { 
        titles.push(randoms[r].title);
    }
    
    let links = ["https://en.wikipedia.org/wiki/"+titles[0].replace(/ /gi, "_"), 
    "https://en.wikipedia.org/wiki/"+titles[1].replace(/ /gi, "_")];

    let xtoolsFetchOne = await new Request("https://xtools.wmcloud.org/api/page/prose/en.wikipedia.org/"+titles[0].replace(/ /gi, "_")); //This API returns char count
    let xtoolsFetchTwo = await new Request("https://xtools.wmcloud.org/api/page/prose/en.wikipedia.org/"+titles[1].replace(/ /gi, "_"));

    let secondFetchArticleOne = await xtoolsFetchOne.loadJSON();
    let secondFetchArticleTwo = await xtoolsFetchTwo.loadJSON();

    secondFetchData = [secondFetchArticleOne.characters, secondFetchArticleTwo.characters];
    return([titles, links, secondFetchData]); // All returns as 2 item arrays.
}

//variables to be used throughout the scripts
var interval = 'day';
var totalTime = timeSpentLast24Hours;

//variables for Wiki Fetch
const wikiParameters = await homeMadeGet();
const firstWiki = wikiParameters[0][0]
const firstWikiLink = wikiParameters[1][0]
const pagesFirstWiki = wikiParameters[2][0]/2400 //assuming 2400 characters is one page
const percentWikiOne = Math.floor(percentageMaker(totalTime, pagesFirstWiki)/100)

const secondWiki = wikiParameters[0][1]
const secondWikiLink = wikiParameters[1][1]
const pagesSecondWiki = wikiParameters[2][1]/2400 //aassuming 2400 characters is one page
const percentWikiTwo = Math.floor(percentageMaker(totalTime, pagesSecondWiki)/100)

//Variables for the book fetch
const dataForTheBook = await bookFetch();

const firstBook = dataForTheBook[0]
const firstBookPages = dataForTheBook[1]
const firstBookLink = dataForTheBook[2]
const percentReadOne = percentageMaker(totalTime, firstBookPages)

const dataForTheBookTwo = await bookFetch();

const secondBook = dataForTheBookTwo[0]
const secondBookPages = dataForTheBookTwo[1]
const secondBookLink = dataForTheBookTwo[2]
const percentReadTwo = percentageMaker(totalTime, secondBookPages)

//variables for the duolingo stuff
const firstDuolingoLink = 'https://www.duolingo.com/';
const secondduolingoLink = firstDuolingoLink
let seriousDuolingoSessions = (totalTime*60)/15;
seriousDuolingoSessions = seriousDuolingoSessions.toFixed(0);
let intenseDuolingoSessions = (totalTime*60)/30;
intenseDuolingoSessions = intenseDuolingoSessions.toFixed(0);

//Variables for the physical activities
const textParametersActivity = activityParameters(totalTime) 

const activity1 = textParametersActivity[0]
const activityLength1 = textParametersActivity[1]
const timeToSpare1 = textParametersActivity[2]
const activityLink1 = 'https://apps.apple.com/dk/app/strava-run-bike-hike/id426826309?l=da'

const activity2 = textParametersActivity[3]
const activityLength2 = textParametersActivity[4]
const timeToSpare2 = textParametersActivity[5]
const activityLink2 = activityLink1

// get the current date
const currentExperimentDate = new Date();

// Define the target date for when participants are supposed to start receiving notifications
const targetDate = new Date('2024-04-27T01:00:00'); // Year-Month-Day format

// Check if the current date is before the wanted date of the start of the experiment
if (
    currentExperimentDate.getMinutes() >= targetDate.getMinutes() &&
    currentExperimentDate.getHours() >= targetDate.getHours() &&
    currentExperimentDate.getDate() >= targetDate.getDate() &&
    currentExperimentDate.getMonth() >= targetDate.getMonth() &&
    currentExperimentDate.getFullYear() >= targetDate.getFullYear()
) {
    //if the script is run after the wanted start-date, then setup daily notification at 17:00
    notificationMaker();
    notif.setDailyTrigger(17,00,true); //when notification is to be shown daily
    notif.schedule();
    UIMaker(totalTime);
} else {
    //If the current date is before participants should start getting notifications, 
    //then set up a notification for when they are supposed to start
    notificationMaker();
    const triggerDate = new Date('2024-04-27T17:00:00')
    notif.setTriggerDate(triggerDate); //when notification is to be shown only one time
    notif.schedule();
    UIMaker(totalTime);

};

//gently close down the script when done
Script.complete();