import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react'
import { getNationalities, getNextImage, getRandomPerson } from './game';

function App() {
  
  const [person, setPerson] = useState(null);
  const [nationalities, setNationalities] = useState(null);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    getNationalities().then(data => setNationalities(data));
    updatePerson();
  }, []);

  function evaluateChoice() {
    if (selection == person.nationality) {
      alert('correct!');
      updatePerson();
    }
    else {
      console.log(person.nationality);
      alert('incorrect!');
    }
  };

  async function updatePerson() {
    return getRandomPerson().then(data => setPerson(data));
  }

  function handleSelectChange(e) {
    setSelection(e.target.value);
  }

  if (person != null && nationalities != null) {

    return (
      <div className="App">
              
                    <br></br>
                    <img style={{ width: "22%", height: "22%" }} alt="hog" src={person.image_url} id="image"/>
                    
                    <br></br>
                    <form> 
                        <label htmlFor="nationalities">Choose a nationality: </label>
                    
                        <select name="nationalities" id="nationalitiesDropDown" value={selection} onChange={(e) => handleSelectChange(e)}>

                          <option value="⬇️ Select a nationality ⬇️">-- Select a nationality --</option>
                            {nationalities.map((nationality, index) => (
                              <option key={index} value={nationality}>
                                {nationality}
                              </option>
                            ))}
                        </select>
                    
                        <br></br>
                    
                        <button type="button" onClick={() => evaluateChoice()} onKeyDown={() => evaluateChoice()}>Submit</button>    <button type="button" onClick={() => updatePerson()}>Next choice </button>
                    </form>
      
      </div>
    );
  }

return (
  <div className="App"> Loading .. </div>
);

}

export default App;
