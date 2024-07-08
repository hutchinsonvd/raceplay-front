import './App.css';
import React, {useEffect, useState} from 'react'
import { getNationalities, getNextImage, getRandomPerson } from './game';

function App() {
  
  const EASY = "easy";
  const MEDIUM = "medium";
  const HARD = "hard";

  const HELTER_SKELTER = "helterSkelter";
  const SANDBOX = "Sandbox";
  

  const [person, setPerson] = useState(null);
  const [nationalities, setNationalities] = useState(null);
  const [selection, setSelection] = useState(null);
  const [difficulty, setDifficulty] = useState(EASY);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameMode, setGameMode] = useState(SANDBOX);

  useEffect(() => {
    if (score != 0) {
      updatePersonAndNationalityList(difficulty);

      if (gameMode === HELTER_SKELTER) {
        setTimeLeft(t => t + 15);
      };
    }
  }, [score]);


  useEffect(() => {

    if (selection == null) {
      return;
    }
    if (selection === person.nationality) {

      
      alert('correct!');
      setScore(score + 1);
      // updatePersonAndNationalityList(difficulty);

      // if (gameMode === HELTER_SKELTER) {
      //   setTimeLeft(t => t +15);
      // };
    }
    else {
      console.log(person.nationality);
      
      alert('incorrect!');

      if (gameMode === HELTER_SKELTER) {
        setTimeLeft(t => t - 20);
      }
      else {
        setScore(0);
      }
    }
  }, [selection]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);

    getRandomPerson().then(data => {
      setPerson(data);
      return data;})
    .then(data => getNationalities(EASY, data))
    .then(data => setNationalities(data));

    return () => clearInterval(timer);
  }, []);

  if (timeLeft <= 0 && gameMode === HELTER_SKELTER) {
    alert("Time's up!");
    setScore(0);
    setTimeLeft(60);
  }


  async function evaluateChoice() {

    if (selection === person.nationality) {

      
      alert('correct!');
      setScore(score + 1);
      // updatePersonAndNationalityList(difficulty);

      // if (gameMode === HELTER_SKELTER) {
      //   setTimeLeft(t => t +15);
      // };
    }
    else {
      console.log(person.nationality);
      
      alert('incorrect!');

      if (gameMode === HELTER_SKELTER) {
        setTimeLeft(t => t - 20);
      }
      else {
        setScore(0);
      }
    }
  };

  async function updateGameMode(gameMode, difficulty) {

    return updatePersonAndNationalityList(difficulty)
      .then(data => setGameMode(gameMode))
      .then(data => {
        if (gameMode === HELTER_SKELTER) {
          
          setTimeLeft(60);
        }

        setScore(0);
      });
  }

  async function nextChoice(difficulty) {
    if (gameMode === HELTER_SKELTER) {
          
      setTimeLeft(60);
    }

    setScore(0);

    return updatePersonAndNationalityList(difficulty);
  }

  async function updatePersonAndNationalityList(difficulty) {
    return getRandomPerson().then(data => {

    setPerson(data);
    setDifficulty(difficulty);

  
    return getNationalities(difficulty, data, score)
        .then(data => setNationalities(data));
    });
  }

  function handleSelectChange(e) {
    console.log(e);
    setSelection(e.target.value);
  }

  async function handleButtonSelect(e) {
    e.preventDefault();
    setSelection(e.target.innerText.replaceAll(' ', '_'));
  }

  if (person != null && nationalities != null) {

    return (
      <div className="App">
              
                    <br></br>
                    <img style={{ width: "22%", height: "22%" }} alt="hog" src={person.image_url} id="image"/>
                    
                    <br></br>
                    <label htmlFor="nationalities">Choose a nationality: </label>

                    <br></br>
                    <br></br>
              

                    {nationalities.map(nat => (
                      <button style={{ marginLeft: '.25rem' }} key={nat} value={nat} onClick={e => handleButtonSelect(e)} >{nat.replaceAll('_', ' ')}</button>
                    ))}
                
                    <br></br>
                    <br></br>
                
                    {/* <button type="button" onClick={() => evaluateChoice()} onKeyDown={() => evaluateChoice()}>Submit</button> */}
                    <button type="button" onClick={() => nextChoice(difficulty)}>I give up! </button>
                

                    

                    <br></br>
                    <br></br>

                    <button type="button" onClick={() => updateGameMode(HELTER_SKELTER, HELTER_SKELTER)}> Helter Skelter Mode </button> <button type="button" onClick={() => updateGameMode(SANDBOX, EASY)}> Easy </button> <button type="button" onClick={() => updateGameMode(SANDBOX, MEDIUM)}> Medium </button> <button type="button" onClick={() => updateGameMode(SANDBOX, HARD)}> Hard </button>
                    <p className='score'> Score: {score} </p>
                    {difficulty === HELTER_SKELTER ? null : <p className='difficulty'> Difficulty: {difficulty} </p> }
                    <p className='gameMode'>Game mode: {gameMode === HELTER_SKELTER ? "Helter Skelter" : gameMode} </p>
                    <p className='timer'>{gameMode === HELTER_SKELTER ? timeLeft : null} </p>

      </div>
    );
  }

return (
  <div className="App"> Loading .. </div>
);

}

export default App;
