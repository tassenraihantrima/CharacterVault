import { useEffect, useState } from 'react'
import './App.css'

function App() {
  // Load saved novels from browser storage when app starts
  const [novels, setNovels] = useState(() => {
    const savedNovels = localStorage.getItem('novels')

    if (savedNovels) {
      return JSON.parse(savedNovels)
    }

    return [
      { id: 1, title: "Royally Chosen", characters: [] },
      { id: 2, title: "Zinnia's Wedding Crasher", characters: [] },
      { id: 3, title: "Draven's Dilemma", characters: [] }
    ]
  })

  // Save novels to browser storage whenever novels changes
  useEffect(() => {
    localStorage.setItem('novels', JSON.stringify(novels))
  }, [novels])

  // Novel states
  const [novelTitle, setNovelTitle] = useState('')
  const [selectedNovelId, setSelectedNovelId] = useState(null)

  // Character form states
  const [characterName, setCharacterName] = useState('')
  const [characterRole, setCharacterRole] = useState('')
  const [characterAge, setCharacterAge] = useState('')
  const [characterPersonality, setCharacterPersonality] = useState('')
  const [characterGoal, setCharacterGoal] = useState('')
  const [characterConflict, setCharacterConflict] = useState('')
  const [characterNotes, setCharacterNotes] = useState('')

  // Selected character
  const [selectedCharacterId, setSelectedCharacterId] = useState(null)

  // Search state
  const [searchTerm, setSearchTerm] = useState('')

  // Where-used form states
  const [usedChapter, setUsedChapter] = useState('')
  const [usedScene, setUsedScene] = useState('')
  const [usedNotes, setUsedNotes] = useState('')

  // AI placeholder state
  const [aiOutput, setAiOutput] = useState('')

  // Find selected novel from id
  const selectedNovel = novels.find(novel => novel.id === selectedNovelId)

  // Find selected character from selected novel
  const selectedCharacter = selectedNovel?.characters.find(
    character => character.id === selectedCharacterId
  )

  function createNovel() {
    if (!novelTitle.trim()) return

    const newNovel = {
      id: Date.now(),
      title: novelTitle,
      characters: []
    }

    setNovels([...novels, newNovel])
    setNovelTitle('')
  }

  function deleteNovel(id) {
    setNovels(novels.filter(novel => novel.id !== id))

    if (selectedNovelId === id) {
      setSelectedNovelId(null)
      setSelectedCharacterId(null)
    }
  }

  function addCharacter() {
    if (!characterName.trim() || !selectedNovel) return

    const newCharacter = {
      id: Date.now(),
      name: characterName,
      role: characterRole,
      age: characterAge,
      personality: characterPersonality,
      goal: characterGoal,
      conflict: characterConflict,
      notes: characterNotes,
      whereUsed: []
    }

    const updatedNovels = novels.map(novel => {
      if (novel.id === selectedNovel.id) {
        return {
          ...novel,
          characters: [...novel.characters, newCharacter]
        }
      }

      return novel
    })

    setNovels(updatedNovels)

    setCharacterName('')
    setCharacterRole('')
    setCharacterAge('')
    setCharacterPersonality('')
    setCharacterGoal('')
    setCharacterConflict('')
    setCharacterNotes('')
  }

  function deleteCharacter(characterId) {
    if (!selectedNovel) return

    const updatedNovels = novels.map(novel => {
      if (novel.id === selectedNovel.id) {
        return {
          ...novel,
          characters: novel.characters.filter(character => character.id !== characterId)
        }
      }

      return novel
    })

    setNovels(updatedNovels)

    if (selectedCharacterId === characterId) {
      setSelectedCharacterId(null)
    }
  }

  function updateSelectedCharacter(field, value) {
    if (!selectedNovel || !selectedCharacter) return

    const updatedNovels = novels.map(novel => {
      if (novel.id === selectedNovel.id) {
        return {
          ...novel,
          characters: novel.characters.map(character => {
            if (character.id === selectedCharacter.id) {
              return {
                ...character,
                [field]: value
              }
            }

            return character
          })
        }
      }

      return novel
    })

    setNovels(updatedNovels)
  }

  function addWhereUsed() {
    if (!selectedNovel || !selectedCharacter) return
    if (!usedChapter.trim() && !usedScene.trim() && !usedNotes.trim()) return

    const newUsedEntry = {
      id: Date.now(),
      chapter: usedChapter,
      scene: usedScene,
      notes: usedNotes
    }

    const updatedNovels = novels.map(novel => {
      if (novel.id === selectedNovel.id) {
        return {
          ...novel,
          characters: novel.characters.map(character => {
            if (character.id === selectedCharacter.id) {
              return {
                ...character,
                whereUsed: [...character.whereUsed, newUsedEntry]
              }
            }

            return character
          })
        }
      }

      return novel
    })

    setNovels(updatedNovels)

    setUsedChapter('')
    setUsedScene('')
    setUsedNotes('')
  }

  function deleteWhereUsed(entryId) {
    if (!selectedNovel || !selectedCharacter) return

    const updatedNovels = novels.map(novel => {
      if (novel.id === selectedNovel.id) {
        return {
          ...novel,
          characters: novel.characters.map(character => {
            if (character.id === selectedCharacter.id) {
              return {
                ...character,
                whereUsed: character.whereUsed.filter(entry => entry.id !== entryId)
              }
            }

            return character
          })
        }
      }

      return novel
    })

    setNovels(updatedNovels)
  }

  function generateFakeAiSummary() {
    if (!selectedCharacter) return

    const summary = `${selectedCharacter.name} is a ${selectedCharacter.role || 'character'} whose goal is ${selectedCharacter.goal || 'not defined yet'}. Their main conflict is ${selectedCharacter.conflict || 'not defined yet'}.`

    setAiOutput(summary)
  }

  const filteredCharacters = selectedNovel?.characters.filter(character => {
    const text = `${character.name} ${character.role} ${character.notes}`.toLowerCase()
    return text.includes(searchTerm.toLowerCase())
  })

  return (
    <div>
      <h1>CharacterVault</h1>

      <h2>My Novels</h2>

      <input
        type="text"
        value={novelTitle}
        onChange={e => setNovelTitle(e.target.value)}
        placeholder="Enter novel title"
      />

      <button onClick={createNovel}>Create Novel</button>

      <ul>
        {novels.map(novel => (
          <li key={novel.id}>
            <button onClick={() => {
              setSelectedNovelId(novel.id)
              setSelectedCharacterId(null)
              setAiOutput('')
            }}>
              {novel.title}
            </button>

            <button onClick={() => deleteNovel(novel.id)}>X</button>
          </li>
        ))}
      </ul>

      {selectedNovel && (
        <div>
          <h2>{selectedNovel.title}</h2>

          <h3>Add Character</h3>

          <input
            type="text"
            value={characterName}
            onChange={e => setCharacterName(e.target.value)}
            placeholder="Character name"
          />

          <input
            type="text"
            value={characterRole}
            onChange={e => setCharacterRole(e.target.value)}
            placeholder="Role"
          />

          <input
            type="text"
            value={characterAge}
            onChange={e => setCharacterAge(e.target.value)}
            placeholder="Age"
          />

          <input
            type="text"
            value={characterPersonality}
            onChange={e => setCharacterPersonality(e.target.value)}
            placeholder="Personality"
          />

          <input
            type="text"
            value={characterGoal}
            onChange={e => setCharacterGoal(e.target.value)}
            placeholder="Goal"
          />

          <input
            type="text"
            value={characterConflict}
            onChange={e => setCharacterConflict(e.target.value)}
            placeholder="Conflict"
          />

          <textarea
            value={characterNotes}
            onChange={e => setCharacterNotes(e.target.value)}
            placeholder="Notes"
          />

          <button onClick={addCharacter}>Add Character</button>

          <h3>Search Characters</h3>

          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, role, or notes"
          />

          <h3>Characters</h3>

          <ul>
            {filteredCharacters.map(character => (
              <li key={character.id}>
                <button onClick={() => {
                  setSelectedCharacterId(character.id)
                  setAiOutput('')
                }}>
                  {character.name}
                </button>

                <button onClick={() => deleteCharacter(character.id)}>X</button>

                <p>
                  <strong>Role:</strong> {character.role}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedCharacter && (
        <div>
          <h2>Character Profile</h2>

          <label>Name:</label>
          <input
            type="text"
            value={selectedCharacter.name}
            onChange={e => updateSelectedCharacter('name', e.target.value)}
          />

          <label>Role:</label>
          <input
            type="text"
            value={selectedCharacter.role}
            onChange={e => updateSelectedCharacter('role', e.target.value)}
          />

          <label>Age:</label>
          <input
            type="text"
            value={selectedCharacter.age}
            onChange={e => updateSelectedCharacter('age', e.target.value)}
          />

          <label>Personality:</label>
          <input
            type="text"
            value={selectedCharacter.personality}
            onChange={e => updateSelectedCharacter('personality', e.target.value)}
          />

          <label>Goal:</label>
          <input
            type="text"
            value={selectedCharacter.goal}
            onChange={e => updateSelectedCharacter('goal', e.target.value)}
          />

          <label>Conflict:</label>
          <input
            type="text"
            value={selectedCharacter.conflict}
            onChange={e => updateSelectedCharacter('conflict', e.target.value)}
          />

          <label>Notes:</label>
          <textarea
            value={selectedCharacter.notes}
            onChange={e => updateSelectedCharacter('notes', e.target.value)}
          />

          <h3>Where Used</h3>

          <input
            type="text"
            value={usedChapter}
            onChange={e => setUsedChapter(e.target.value)}
            placeholder="Chapter"
          />

          <input
            type="text"
            value={usedScene}
            onChange={e => setUsedScene(e.target.value)}
            placeholder="Scene"
          />

          <textarea
            value={usedNotes}
            onChange={e => setUsedNotes(e.target.value)}
            placeholder="What happened here?"
          />

          <button onClick={addWhereUsed}>Add Where Used</button>

          <ul>
            {selectedCharacter.whereUsed.map(entry => (
              <li key={entry.id}>
                <strong>Chapter:</strong> {entry.chapter}
                <br />
                <strong>Scene:</strong> {entry.scene}
                <br />
                <strong>Notes:</strong> {entry.notes}
                <br />
                <button onClick={() => deleteWhereUsed(entry.id)}>X</button>
              </li>
            ))}
          </ul>

          <h3>AI Tool Placeholder</h3>

          <button onClick={generateFakeAiSummary}>
            Generate Character Summary
          </button>

          {aiOutput && (
            <p>{aiOutput}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default App