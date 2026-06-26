import { useState } from 'react'

function CharacterProfile({ character, onUpdateCharacter, onAddWhereUsed, onDeleteWhereUsed }) {
  // Where-used inputs
  const [chapter, setChapter] = useState('')
  const [scene, setScene] = useState('')
  const [notes, setNotes] = useState('')

  // Fake AI output for now
  const [aiOutput, setAiOutput] = useState('')

  if (!character) {
    return (
      <section className="panel profilePanel">
        <h2>Character Profile</h2>
        <p className="emptyText">Select a character to view details.</p>
      </section>
    )
  }

  function handleAddWhereUsed() {
    if (!chapter.trim() && !scene.trim() && !notes.trim()) return

    onAddWhereUsed({
      chapter,
      scene,
      notes
    })

    setChapter('')
    setScene('')
    setNotes('')
  }

  function generateSummary() {
    const summary = `${character.name} is a ${character.role || 'character'} with the goal of ${
      character.goal || 'something not defined yet'
    }. Their main conflict is ${character.conflict || 'not defined yet'}.`

    setAiOutput(summary)
  }

  return (
    <section className="panel profilePanel">
      <h2>Character Profile</h2>

      <label>Name</label>
      <input
        value={character.name}
        onChange={e => onUpdateCharacter('name', e.target.value)}
      />

      <label>Role</label>
      <input
        value={character.role}
        onChange={e => onUpdateCharacter('role', e.target.value)}
      />

      <label>Age</label>
      <input
        value={character.age}
        onChange={e => onUpdateCharacter('age', e.target.value)}
      />

      <label>Personality</label>
      <input
        value={character.personality}
        onChange={e => onUpdateCharacter('personality', e.target.value)}
      />

      <label>Goal</label>
      <input
        value={character.goal}
        onChange={e => onUpdateCharacter('goal', e.target.value)}
      />

      <label>Conflict</label>
      <input
        value={character.conflict}
        onChange={e => onUpdateCharacter('conflict', e.target.value)}
      />

      <label>Notes</label>
      <textarea
        value={character.notes}
        onChange={e => onUpdateCharacter('notes', e.target.value)}
      />

      <h3>Where Used</h3>

      <div className="formGrid">
        <input value={chapter} onChange={e => setChapter(e.target.value)} placeholder="Chapter" />
        <input value={scene} onChange={e => setScene(e.target.value)} placeholder="Scene" />
      </div>

      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="What happened here?"
      />

      <button className="primaryButton" onClick={handleAddWhereUsed}>
        Add Scene Use
      </button>

      <div className="whereList">
        {character.whereUsed.map(entry => (
          <div key={entry.id} className="whereCard">
            <p><strong>Chapter:</strong> {entry.chapter}</p>
            <p><strong>Scene:</strong> {entry.scene}</p>
            <p><strong>Notes:</strong> {entry.notes}</p>

            <button onClick={() => onDeleteWhereUsed(entry.id)}>Delete</button>
          </div>
        ))}
      </div>

      <h3>AI Tool Placeholder</h3>

      <button className="primaryButton" onClick={generateSummary}>
        Generate Character Summary
      </button>

      {aiOutput && <div className="aiBox">{aiOutput}</div>}
    </section>
  )
}

export default CharacterProfile