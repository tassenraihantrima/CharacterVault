import { useState } from 'react'
import './App.css'

function App() {
  //setNovels: a function that updates the novels array
  const [novels, setNovels] = useState([
    { id: 1, title: "Royally Chosen" },
    { id: 2, title: "Zinnia's Wedding Crasher" },
    { id: 3, title: "Draven's Dilemma" }
  ])

  //novelTitle: whatever the user types in the input box
  //setNovelTitle: a function that updates the input value
  const [novelTitle, setNovelTitle] = useState('')
  //selectedNovel: the novel that the user clicks on
  const [selectedNovel, setSelectedNovel] = useState(null)

  // this function runs when Create Novel button is clicked
  function createNovel() {
    // if the input is empty or only spaces, do nothing 
    if (!novelTitle.trim()) {
      return
    }

    // create a new novel object 
    const newNovel = {
      id: novels.length + 1,
      title: novelTitle
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
          <h3>Selected Novel</h3>
          <p>{selectedNovel.title}</p>
        </div>
      )}
    </div>
  )
}

export default App
