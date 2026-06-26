import { useState } from 'react'

function CharacterList({
  selectedNovel,
  selectedCharacterId,
  onSelectCharacter,
  onAddCharacter,
  onDeleteCharacter
}) {
  // Search input
  const [search, setSearch] = useState('')

  // Character form inputs
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [age, setAge] = useState('')
  const [personality, setPersonality] = useState('')
  const [goal, setGoal] = useState('')
  const [conflict, setConflict] = useState('')
  const [notes, setNotes] = useState('')

  if (!selectedNovel) {
    return (
      <section className="panel">
        <h2>Characters</h2>
        <p className="emptyText">Select a novel first.</p>
      </section>
    )
  }

  function handleAddCharacter() {
    if (!name.trim()) return

    onAddCharacter({
      name,
      role,
      age,
      personality,
      goal,
      conflict,
      notes
    })

    setName('')
    setRole('')
    setAge('')
    setPersonality('')
    setGoal('')
    setConflict('')
    setNotes('')
  }

  const filteredCharacters = selectedNovel.characters.filter(character => {
    const text = `${character.name} ${character.role} ${character.notes}`.toLowerCase()
    return text.includes(search.toLowerCase())
  })

  return (
    <section className="panel">
      <h2>Characters</h2>
      <h3>{selectedNovel.title}</h3>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search characters"
      />

      <div className="formGrid">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input value={role} onChange={e => setRole(e.target.value)} placeholder="Role" />
        <input value={age} onChange={e => setAge(e.target.value)} placeholder="Age" />
        <input
          value={personality}
          onChange={e => setPersonality(e.target.value)}
          placeholder="Personality"
        />
        <input value={goal} onChange={e => setGoal(e.target.value)} placeholder="Goal" />
        <input
          value={conflict}
          onChange={e => setConflict(e.target.value)}
          placeholder="Conflict"
        />
      </div>

      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />

      <button className="primaryButton" onClick={handleAddCharacter}>
        Add Character
      </button>

      <div className="list">
        {filteredCharacters.map(character => (
          <div
            key={character.id}
            className={character.id === selectedCharacterId ? 'listItem active' : 'listItem'}
          >
            <button className="nameButton" onClick={() => onSelectCharacter(character.id)}>
              {character.name}
            </button>

            <button className="deleteButton" onClick={() => onDeleteCharacter(character.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CharacterList