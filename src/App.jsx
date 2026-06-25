import { useState } from 'react'
import './App.css'

function App() {
  // novels: stores all novel objects
  // setNovels: updates the novels array
  const [novels, setNovels] = useState([
    { id: 1, title: "Royally Chosen", characters: [] },
    { id: 2, title: "Zinnia's Wedding Crasher", characters: [] },
    { id: 3, title: "Draven's Dilemma", characters: [] }
  ])

  // novelTitle: stores what user types for a new novel
  const [novelTitle, setNovelTitle] = useState('')

  // selectedNovelId: stores ONLY the id of the clicked novel
  const [selectedNovelId, setSelectedNovelId] = useState(null)

  // character input states
  const [characterName, setCharacterName] = useState('')
  const [characterRole, setCharacterRole] = useState('')
  const [characterNotes, setCharacterNotes] = useState('')

  // Find the full selected novel object from novels array
  const selectedNovel = novels.find(novel => novel.id === selectedNovelId)

  function createNovel() {
    // Stop if input is empty
    if (!novelTitle.trim()) return

    // Create new novel object
    const newNovel = {
      id: Date.now(),
      title: novelTitle,
      characters: []
    }

    // Add new novel to array
    setNovels([...novels, newNovel])

    // Clear input
    setNovelTitle('')
  }

  function deleteNovel(id) {
    // Remove novel with matching id
    setNovels(novels.filter(novel => novel.id !== id))

    // If deleted novel was selected, unselect it
    if (selectedNovelId === id) {
      setSelectedNovelId(null)
    }
  }

  function addCharacter() {
    // Stop if no character name or no novel selected
    if (!characterName.trim() || !selectedNovel) return

    // Create new character object
    const newCharacter = {
      id: Date.now(),
      name: characterName,
      role: characterRole,
      notes: characterNotes
    }

    // Update only the selected novel
    const updatedNovels = novels.map(novel => {
      if (novel.id === selectedNovel.id) {
        return {
          ...novel,
          characters: [...novel.characters, newCharacter]
        }
      }

      return novel
    })

    // Save updated novels array
    setNovels(updatedNovels)

    // Clear character input boxes
    setCharacterName('')
    setCharacterRole('')
    setCharacterNotes('')
  }

  function deleteCharacter(characterId) {
    // Stop if no novel is selected
    if (!selectedNovel) return

    // Update only the selected novel
    const updatedNovels = novels.map(novel => {
      if (novel.id === selectedNovel.id) {
        return {
          ...novel,

          // Keep every character except the one clicked
          characters: novel.characters.filter(character => character.id !== characterId)
        }
      }

      return novel
    })

    // Save updated novels array
    setNovels(updatedNovels)
  }

  return (
    <div>
      {/* Main app title */}
      <h1>CharacterVault</h1>

      {/* Novel section */}
      <h2>My Novels</h2>

      {/* Input for creating novel */}
      <input
        type="text"
        value={novelTitle}
        onChange={e => setNovelTitle(e.target.value)}
        placeholder="Enter novel title"
      />

      {/* Create novel button */}
      <button onClick={createNovel}>Create Novel</button>

      {/* List of novels */}
      <ul>
        {novels.map(novel => (
          <li key={novel.id}>
            {/* Select this novel */}
            <button onClick={() => setSelectedNovelId(novel.id)}>
              {novel.title}
            </button>

            {/* Delete this novel */}
            <button onClick={() => deleteNovel(novel.id)}>
              X
            </button>
          </li>
        ))}
      </ul>

      {/* Only show this section when a novel is selected */}
      {selectedNovel && (
        <div>
          {/* Selected novel title */}
          <h3>Selected Novel</h3>
          <p>{selectedNovel.title}</p>

          {/* Character form */}
          <h3>Characters</h3>

          {/* Character name input */}
          <input
            type="text"
            value={characterName}
            onChange={e => setCharacterName(e.target.value)}
            placeholder="Enter character name"
          />

          {/* Character role input */}
          <input
            type="text"
            value={characterRole}
            onChange={e => setCharacterRole(e.target.value)}
            placeholder="Enter character role"
          />

          {/* Character notes input */}
          <input
            type="text"
            value={characterNotes}
            onChange={e => setCharacterNotes(e.target.value)}
            placeholder="Enter character notes"
          />

          {/* Add character button */}
          <button onClick={addCharacter}>Add Character</button>

          {/* Character list */}
          <ul>
            {selectedNovel.characters.map(character => (
              <li key={character.id}>
                {/* Character delete button */}
                <button onClick={() => deleteCharacter(character.id)}>
                  X
                </button>

                <br />

                <strong>Name:</strong> {character.name}
                <br />

                <strong>Role:</strong> {character.role}
                <br />

                <strong>Notes:</strong> {character.notes}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App