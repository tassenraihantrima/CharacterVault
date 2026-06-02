import { useState } from 'react'
import './App.css'

function App() {
  //setNovels: a function that updates the novels array
  const [novels, setNovels] = useState([
    { id: 1, title: 'Novel 1' },
    { id: 2, title: 'Novel 2' },
    { id: 3, title: 'Novel 3' }
  ])

  //novelTitle: whatever the user types in the input box
  //setNovelTitle: a function that updates the input value
  const [novelTitle, setNovelTitle] = useState('')

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
          <li key={novel.id}>{novel.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
