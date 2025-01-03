import './App.css';
import React, {useEffect, useState} from 'react'
import Modal from 'react-modal'
import { isSameRegion, getNationalities, getNextImage, getRandomPerson, isHighScore, getHighScores, addHighScore } from './game';

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
  const [showHighScoreModal, setShowHighScoreModal] = useState(false);
  const [showHighScoreListModal, setShowHighScoreListModal] = useState(false);
  const [highScoreList, setHighScoreList] = useState([])
  const [canAddHighScore, setCanAddHighScore] = useState(false);

  useEffect(() => {
    if (score != 0) {
      updatePersonAndNationalityList(difficulty);

      if (gameMode === HELTER_SKELTER) {
        //TODO: add time as function of score...higher score less time
        setTimeLeft(t => t + 15);
      };
    }
  }, [score]);

  useEffect(() => {

    if (selection == null) {
      return;
    }
    if (selection === person.nationality) {
  
      setScore(score + 5);
    }
    else {
      console.debug(person.nationality);

      isSameRegion(person.nationality, selection)
      .then(result => {
        if (!result) {

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

  if (timeLeft <= 0 && gameMode === HELTER_SKELTER && !showScoreModal && !showHighScoreModal ) {

    try {
      showModalForHelterSkelter();
    }
    catch (error) {
      console.error(error)
    }
  }

  async function showModalForHelterSkelter() {

    //TODO: put a lock on this as helter skelter will continously call it
    if (!showHighScoreModal && !showScoreModal) {
      isHighScore(gameMode, difficulty, score)
      .then(highScore => {

        if (!highScore) {
          setRecentScore(score);
          setShowScoreModal(true);
        }
        else {
          setCanAddHighScore(true);
          setRecentScore(score);
          setShowHighScoreModal(true);
        }
    })
  }
    
  }

  async function updateGameMode(gameMode, difficulty) {

    setScore(0);

    if (HELTER_SKELTER == gameMode) {

      return updatePersonAndNationalityListForHelterSkelter()
      .then(data => setGameMode(gameMode))
      .then(data => {
        if (gameMode === HELTER_SKELTER) {
          
          setTimeLeft(60);
        }
      })
    }

    return updatePersonAndNationalityList(difficulty)
      .then(data => setGameMode(gameMode));
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
    setSelection(null);
  
    return getNationalities(difficulty, data, score)
        .then(data => setNationalities(data));
    });
  }

  async function updatePersonAndNationalityListForHelterSkelter() {
    return getRandomPerson().then(data => {

    setPerson(data);
    setDifficulty(HELTER_SKELTER);
    setSelection(null);
  
    return getNationalities(HELTER_SKELTER, data, 0)
        .then(data => setNationalities(data));
    });
  }

  async function handleButtonSelect(e) {
    e.preventDefault();
    setSelection(e.target.innerText.replaceAll(' ', '_'));
  }

  //TODO: check for high score and show high score modal
  async function pauseGameandShowModal() {
    isHighScore(gameMode, difficulty, score)
    .then(highScore => {

      if (!highScore) {
        setRecentScore(score);
        setShowScoreModal(true)
      }
      else {
        setCanAddHighScore(true);
        setRecentScore(score);
        setShowHighScoreModal(true);
      }
  })
  }

  //TODO: check for high score and show high score modal
  async function restartGameOnModalClose() {
    
    setShowScoreModal(false);
    setShowHighScoreModal(false);
    setScore(0);
    
    if (HELTER_SKELTER == gameMode) {
      setTimeLeft(60);
    } 

    updatePersonAndNationalityList(difficulty);
  }

  async function processHighScore(e) {

    if (canAddHighScore) {
      var name = e.target.form[0].value;
      if (name.length >= 15) {
        alert('Your name must be 15 character or less')
        return;
      }

      setCanAddHighScore(false);
      return addHighScore(gameMode, difficulty, recentScore, name);
    }

    alert('You already submitted a high score for this round')
  }

  async function retrieveHighScoresAndPopulateHighScoreList() {

    return getHighScores(gameMode, difficulty)
    .then(scores => {
      setHighScoreList(scores)
      setShowHighScoreListModal(true);
    });
  }

  function formatHighScoreList() {

    var formatHighScoreList = [];
    var numScores = highScoreList.length > 5 ? 5 : highScoreList.length

    for (var i = 0; i < numScores; i++) {
      if (i == 0) {
        formatHighScoreList.push(<h1>{highScoreList[i].player_name}: {highScoreList[i].score} </h1>)
      }
      else if (i == 1) {
        formatHighScoreList.push(<h2>{highScoreList[i].player_name}: {highScoreList[i].score} </h2>)
      }
      else if (i == 2) {
        formatHighScoreList.push(<h3>{highScoreList[i].player_name}: {highScoreList[i].score} </h3>)
      }
      else {
        formatHighScoreList.push(<p>{highScoreList[i].player_name}: {highScoreList[i].score} </p>)
      }
    }

    return formatHighScoreList;
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
                    <label style={{fontSize: '20px' }} htmlFor="nationalities">Choose a nationality: </label>

                    <br></br>
                    <br></br>
              
                      {nationalities.map(nat => (
                        <button style={{ marginLeft: '.25rem', fontSize: '20px' }} key={nat} onClick={e => handleButtonSelect(e)} >{nat.replaceAll('_', ' ')}</button>
                      ))}
                
                    <br></br>
                    <br></br>
                
                    <button type="button" onClick={() => nextChoice(difficulty)}>I give up! </button>
                

                    <Modal isOpen={showScoreModal}
                      onRequestClose={() => restartGameOnModalClose()} 
                      style={modalCSS}>

                      <h2>You scored: {recentScore} </h2>
                      <p>Game mode:  {gameMode === HELTER_SKELTER ? "Helter Skelter" : gameMode}</p>
                      <p>{gameMode != HELTER_SKELTER ? "Difficulty: " + difficulty : null}</p>
                      <button className="modalButton" type="button" onClick={() => restartGameOnModalClose()}>Retry</button>
                    </Modal>

                    <Modal isOpen={showHighScoreModal}
                    onRequestClose={() => restartGameOnModalClose()} 
                    style={modalCSS}>

                      <div>
                        <h2>You scored a top 5 score of: {recentScore} </h2>
                        <p>Game mode:  {gameMode === HELTER_SKELTER ? "Helter Skelter" : gameMode}</p>
                        <p>{gameMode != HELTER_SKELTER ? "Difficulty: " + difficulty : null}</p>
                      </div>

                      <div>
                        <form>
                          <input type='text' name='name' placeholder='Enter your name (< 15 digits) for the leaderboard'></input>
                          <button type='button' onClick={(e) => processHighScore(e)}>Enter</button>
                        </form>
                      </div>

                      <div>
                        <button type="button" onClick={() => retrieveHighScoresAndPopulateHighScoreList()} >Show high scores</button>
                      </div>

                      <div>
                        <button type='button' onClick={() => restartGameOnModalClose()}>Exit</button>
                      </div>
                    </Modal>

                    <Modal isOpen={showHighScoreListModal}
                    onRequestClose={() => setShowHighScoreListModal(false)}
                    style={modalCSS}>

                      {formatHighScoreList()}

                    </Modal>

                    <br></br>
                    <br></br>

                    <button type="button" onClick={() => updateGameMode(HELTER_SKELTER, HELTER_SKELTER)}> Helter Skelter Mode </button> <button type="button" onClick={() => updateGameMode(SANDBOX, EASY)}> Easy </button> <button type="button" onClick={() => updateGameMode(SANDBOX, MEDIUM)}> Medium </button> <button type="button" onClick={() => updateGameMode(SANDBOX, HARD)}> Hard </button>
                    
                    {/* Why did we have recentScore instead of score there */}
                    <p className='score' style={{fontSize: '20px' }}> Score: {score} </p>
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
