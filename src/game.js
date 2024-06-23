//so simple html webpage
//it auto loads a picture from dataset
//user has a scroll bar with all the possible nationalities to choose
import axios from 'axios';

//make a server and just deploy it to render to continue testing
var TEST_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Bundesarchiv_Bild_183-1985-0810-023,_Christine_Wachtel,_Hildegard_Körner-Ullrich.jpg/200px-Bundesarchiv_Bild_183-1985-0810-023,_Christine_Wachtel,_Hildegard_Körner-Ullrich.jpg";
const backendURL = "https://raceplay.onrender.com";

export function getNextImage() {

    getRandomPerson()
    .then(person => {
        console.log(person);
        var imageUrl = person.image_url;
        document.getElementById("image").src = imageUrl;
    });
}

export async function getRandomPerson() {
    console.log(backendURL);

    return await axios.get(backendURL + "/random")
    .then(response => {
        console.log(response);
        return response.data;})
}


export async function getNationalities() {
    console.log(backendURL);

    return await axios.get(backendURL + "/nationalities")
    .then(response => {
        console.log(response);
        return response.data;})
}