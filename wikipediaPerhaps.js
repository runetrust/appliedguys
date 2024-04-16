
let url = "https://en.wikipedia.org/w/api.php?origin=*"; 

const params = {
    action: "query",
    format: "json",
    list: "random",
    prop: "info",
    inprop: "url|talkid",
    rnlimit: "2", //how many articles?
    rnnamespace: 0 //Restricting to only actual pages and not "talks"
};

Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

async function homemadeGet(){
    const response = await fetch(url)
    const parsedFetch = await response.json()
    console.log(url)
    let randoms = parsedFetch.query.random;
    let titles = [];
    for (r in randoms) { 
        titles.push(randoms[r].title);
    }
    
    let links = ["https://en.wikipedia.org/wiki/"+titles[0].replace(/ /gi, "_"), 
    "https://en.wikipedia.org/wiki/"+titles[1].replace(/ /gi, "_")];

    let xtoolsFetchOne = await fetch("https://xtools.wmcloud.org/api/page/prose/en.wikipedia.org/"+titles[0].replace(/ /gi, "_")); //This API returns char count
    let xtoolsFetchTwo = await fetch("https://xtools.wmcloud.org/api/page/prose/en.wikipedia.org/"+titles[1].replace(/ /gi, "_"));

    let secondFetchArticleOne = await xtoolsFetchOne.json();
    let secondFetchArticleTwo = await xtoolsFetchTwo.json();

    secondFetchData = [secondFetchArticleOne.characters, secondFetchArticleTwo.characters];

    console.log(links);
    console.log(secondFetchData);
    
    return([titles, links, secondFetchData]); // All returns as 2 item arrays.
}
homemadeGet();
