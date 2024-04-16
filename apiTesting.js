// Function for random Integer between 0 and 75, used for indexing (fetch returns 10 items)
function getRandomInt() {
    return Math.floor(Math.random() * 75);
}

const baseURL = 'https://www.googleapis.com/books/v1/volumes?q='
// Top 100 selling books in UK, 25 items removed as no link was available
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

async function getBook(){
    const googleBooks = (bookOptionsReplaced[getRandomInt()]);

    // get list of books by fetching from the link assigned to googleBooks, parsed to JSON
    const response = await fetch(googleBooks)
    const bookList = await response.json()

    // find book index 0 and link to the book for second fetch
    const randomBook = bookList.items[0].selfLink

    // request the book data and defining the title of the extracted book
    const response2 = await fetch(randomBook)
    const link = await response2.json()
    const title = link.volumeInfo.title 
    const pages = link.volumeInfo.pageCount
    const infoLink = link.volumeInfo.infoLink

    return([title, pages, infoLink])
}

async function bookFetch(){
    let bookData = await getBook()
    console.log(bookData)
    return(bookData)
}
bookFetch()

/*
if (pages === undefined){
    console.log(`The book "${title}" has no page count assigned in Google Books, and therefore we cannot tell you how much of it you could have read in your ${screenTime} minutes of screentime.`)
} else {
    console.log(`"${title}" is ${pages} pages long. With your screentime of ${screenTime} minutes, you could have read about ${Math.round(readPercentage)} percent of the book!`)
}
*/
// Next task is to let the fetch depend upon given genre, may be unfeasible as not all books have a genre assigned
