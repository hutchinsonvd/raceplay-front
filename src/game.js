//so simple html webpage
//it auto loads a picture from dataset
//user has a scroll bar with all the possible nationalities to choose
import axios from 'axios';

//make a server and just deploy it to render to continue testing
//const backendURL = "https://raceplay.onrender.com"; //prod only
const backendURL = "http://localhost:8080";
//const SECRET = process.env.REACT_APP_SECRET; //prod only
const SECRET = "SECRET";

axios.defaults.headers.common['Authorization'] = SECRET;

export function getNextImage() {

    getRandomPerson()
    .then(person => {
        console.log(person);
        var imageUrl = person.image_url;
        document.getElementById("image").src = imageUrl;
    });
}

export async function getRandomPerson() {
    console.debug(backendURL);
    console.debug(SECRET);

    return await axios.get(backendURL + "/random")
    .then(response => {
        console.debug(response);
        return response.data;
    })
}


export async function getNationalities(difficulty, person, score) {
    console.debug(JSON.stringify(person));

    if ("helterSkelter" === difficulty) {

        return getHelterSkelterNationalities(person, score);
    }

    return await axios.post(backendURL + "/nationalities" + "/" + difficulty, {data: JSON.stringify(person)},
    {
        headers: { 'Content-Type': 'application/json; charset=UTF-8', "Authorization": SECRET, "Access-Control-Allow-Origin" : "*",},
      })
    .then(response => {
        console.debug(response);
        return response.data;
    })
}

export async function getHelterSkelterNationalities(person, score) {

    return await axios.post(backendURL + "/helterSkelter", {data: JSON.stringify(person), score: JSON.stringify(score)},
    {
        headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: SECRET },
      })
    .then(response => {
        console.debug(response);
        return response.data;
    })
}

export async function isSameRegion(actual, candidate) {

    return await axios.post(backendURL + "/region", {actual: actual, candidate: candidate},
    {
        headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: SECRET },
      })
      .then(response => {
        console.debug(response)
        console.debug(actual + " vs " + candidate)
        return response.data});
}