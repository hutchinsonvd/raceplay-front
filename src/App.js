import './App.css';
import React, {useEffect, useState} from 'react'
import Modal from 'react-modal'
import { isSameRegion, getNationalities, getNextImage, getRandomPerson } from './game';

function App() {
  
  const EASY = "easy";
  const MEDIUM = "medium";
  const HARD = "hard";

  const HELTER_SKELTER = "helterSkelter";
  const SANDBOX = "Sandbox";
  
  const modalCSS = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };


  const [person, setPerson] = useState(null);
  const [nationalities, setNationalities] = useState(null);
  const [selection, setSelection] = useState(null);
  const [difficulty, setDifficulty] = useState(EASY);
  const [score, setScore] = useState(0);
  const [recentScore, setRecentScore] = useState(score);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameMode, setGameMode] = useState(SANDBOX);
  const [showScoreModal, setShowScoreModal] = useState(false);

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
  
      setScore(score + 5);
    }
    else {
      console.debug(person.nationality);

      isSameRegion(person.nationality, selection)
      .then(result => {
        if (!result) {
          alert('incorrect!');

          if (gameMode === HELTER_SKELTER) {
            setTimeLeft(t => t - 20);
          }
          else {
            
            pauseGameandShowModal();
          }
        }
        else {
          alert('Same region but not the right country')

          if (gameMode === HELTER_SKELTER) {
            setTimeLeft(t => t + 5);
            setScore(score + 1)
          }
          else {
            setScore(score + 1);
          }
        }
      })
      
      
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

  if (timeLeft <= 0 && gameMode === HELTER_SKELTER && !showScoreModal) {

    try {
      showModalForHelterSkelter();
    }
    catch (error) {
      console.error(error)
    }
  }

  async function showModalForHelterSkelter() {
    setRecentScore(score);
    setScore(0);
    setShowScoreModal(true);
  }

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

  async function pauseGameandShowModal() {
    setRecentScore(score);
    setShowScoreModal(true);
  }

  async function restartGameOnModalClose() {
    setShowScoreModal(false);
    setScore(0);
    
    if (HELTER_SKELTER == gameMode) {
      setTimeLeft(60);
    } 

    updatePersonAndNationalityList(difficulty);
    
  }

  async function logBrokenImageAndGetNewPerson() {
    //TODO: log to database broken image

    updatePersonAndNationalityList(difficulty);
  }

  if (person != null && nationalities != null) {

    return (
      <div className="App">
              
                    <br></br>
                    <img style={{ width: "22%", height: "22%" }} alt="hog" src={person.image_url} onError={() => logBrokenImageAndGetNewPerson()}id="image"/>
                    
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
                

                    <Modal isOpen={showScoreModal}
                      onRequestClose={() => restartGameOnModalClose()} 
                      style={modalCSS}>

                      <h2>You scored: {recentScore} </h2>
                      <p>Game mode:  {gameMode === HELTER_SKELTER ? "Helter Skelter" : gameMode}</p>
                      <p>{gameMode != HELTER_SKELTER ? "Difficulty: " + difficulty : null}</p>
                      <button className="modalButton" type="button" onClick={() => restartGameOnModalClose()}>Retry</button>
        </Modal>

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
