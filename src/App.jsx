import { useState } from 'react'
import './App.css'

function App() {
  //setNovels: a function that updates the novels array
  const [novels, setNovels] = useState([
    { id: 1, title: "Royally Chosen", characters: [] },
    { id: 2, title: "Zinnia's Wedding Crasher", characters: [] },
    { id: 3, title: "Draven's Dilemma", characters: [] }
  ])

  //novelTitle: whatever the user types in the input box
  //setNovelTitle: a function that updates the input value
  const [novelTitle, setNovelTitle] = useState('')

  //selectedNovel: the novel that the user clicks on
  const [selectedNovel, setSelectedNovel] = useState(null)

  // characterName: whatever the user types in the character input box
  const [characterName, setCharacterName] = useState('')

  // this function runs when Create Novel button is clicked
  function createNovel() {
    // if the input is empty or only spaces, do nothing 
    if (!novelTitle.trim()) {
      return
    }

    // create a new novel object 
    const newNovel = {
      id: Date.now(),
      title: novelTitle,
      characters: []
    }

    // add the new novel to the novels array
    setNovels([...novels, newNovel])

    // clear the input box
    setNovelTitle('')
  }

  //Delete
  function deleteNovel(id) {
    // keep every novel except the one with the matching id
    setNovels(novels.filter(novel => novel.id !== id))

    // if the deleted novel is the selected one, clear the selection
    if (selectedNovel && selectedNovel.id === id) {
      setSelectedNovel(null)
    }
  }

  // this function runs when Add Character button is clicked
  function addCharacter() {

    // if the character name is empty or only spaces, or if no novel is selected, do nothing
    if (!characterName.trim() || !selectedNovel) {
      return
    }

    // loops through all novels
    const updatedNovels = novels.map(novel => {
      //find the selected novel
      if (novel.id === selectedNovel.id) {
        return {
          ...novel,
          characters: [...novel.characters, characterName]
        }
      }
      return novel
    })

    // update React State
    setNovels(updatedNovels)

    const updatedSelectedNovel = updatedNovels.find(novel => novel.id === selectedNovel.id)
    setSelectedNovel(updatedSelectedNovel)

    setCharacterName('')
  }
  return (
    <div>
      {/* Main app title */}
      <h1>CharacterVault</h1>

      {/* Novel section title */}
      <h2>My Novels</h2>

      {/* Input box for novel title */}
      <input
        type="text"
        value={novelTitle}
        onChange={e => setNovelTitle(e.target.value)}
        placeholder="Enter novel title"
      />

      {/* Button to create a new novel */}
      <button onClick={createNovel}>Create Novel</button>

      {/* Display the list of novels */}
      <ul>
        {novels.map(novel => (
          <li key={novel.id}> 
            <button onClick={() => setSelectedNovel(novel)}> {novel.title} </button>
            <button onClick={() => deleteNovel(novel.id)}>X</button>
          </li>
        ))}
      </ul>
      {selectedNovel && (
        <div>
          {/* Display selected novel */}
          <h3>Selected Novel</h3>
          <p>{selectedNovel.title}</p>

          {* Character Section */}
          <h3>Characters</h3>
        
          {/* Input box for character name */}
          <input
            type="text"
            value={characterName}
            onChange={e => setCharacterName(e.target.value)}
            placeholder="Enter character name"
          />

          {* Button to add character to the selected novel */}
          <button onClick={addCharacter}>Add Character</button>

          {/* Display the list of characters for the selected novel */}
          <ul>
            {selectedNovel.characters.map((character, index) => (
              <li key={index}>{character}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
