import { useState } from 'react'

function CharacterProfile({ character, onUpdateCharacter, onAddWhereUsed, onDeleteWhereUsed }) {
  // Controls which tab is currently open
  const [activeTab, setActiveTab] = useState('profile')

  // Inputs for the "Where Used" form
  const [chapter, setChapter] = useState('')
  const [scene, setScene] = useState('')
  const [sceneNotes, setSceneNotes] = useState('')

  // Placeholder output for future AI tools
  const [aiOutput, setAiOutput] = useState('')

  // If no character is selected, show empty message
  if (!character) {
    return (
      <section className="panel profilePanel">
        <h2>Character Profile</h2>
        <p className="emptyText">Select a character to view and edit details.</p>
      </section>
    )
  }

  // Adds a chapter/scene reference to the selected character
  function handleAddWhereUsed() {
    if (!chapter.trim() && !scene.trim() && !sceneNotes.trim()) return

    onAddWhereUsed({
      chapter,
      scene,
      notes: sceneNotes
    })

    setChapter('')
    setScene('')
    setSceneNotes('')
  }

  // Temporary AI-style summary without using a real API yet
  function generateSummary() {
    const summary = `${character.name} is a ${character.role || 'character'} whose goal is ${
      character.goal || 'not defined yet'
    }. Their main conflict is ${character.conflict || 'not defined yet'}.`

    setAiOutput(summary)
  }

  return (
    <section className="panel profilePanel">
      <div className="profileHeader">
        <div className="largeAvatar">
          {character.name ? character.name[0].toUpperCase() : '?'}
        </div>

        <div>
          <h2>{character.name || 'Unnamed Character'}</h2>
          <p>{character.role || 'No role yet'}</p>
        </div>
      </div>

      {/* Tab buttons */}
      <div className="tabs">
        <button onClick={() => setActiveTab('profile')}>Profile</button>
        <button onClick={() => setActiveTab('whereUsed')}>Where Used</button>
        <button onClick={() => setActiveTab('relationships')}>Relationships</button>
        <button onClick={() => setActiveTab('timeline')}>Timeline</button>
        <button onClick={() => setActiveTab('ai')}>AI Tools</button>
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <>
          <div className="sectionCard">
            <h3>General</h3>

            <label>Name</label>
            <input value={character.name} onChange={e => onUpdateCharacter('name', e.target.value)} />

            <label>Role</label>
            <input value={character.role} onChange={e => onUpdateCharacter('role', e.target.value)} />

            <label>Age</label>
            <input value={character.age} onChange={e => onUpdateCharacter('age', e.target.value)} />
          </div>

          <div className="sectionCard">
            <h3>Story Development</h3>

            <label>Personality</label>
            <textarea value={character.personality} onChange={e => onUpdateCharacter('personality', e.target.value)} />

            <label>Goal</label>
            <textarea value={character.goal} onChange={e => onUpdateCharacter('goal', e.target.value)} />

            <label>Conflict</label>
            <textarea value={character.conflict} onChange={e => onUpdateCharacter('conflict', e.target.value)} />

            <label>Notes</label>
            <textarea value={character.notes} onChange={e => onUpdateCharacter('notes', e.target.value)} />
          </div>
        </>
      )}

      {/* Where Used tab */}
      {activeTab === 'whereUsed' && (
        <div className="sectionCard">
          <h3>Scene / Chapter Tracking</h3>

          <div className="formGrid">
            <input value={chapter} onChange={e => setChapter(e.target.value)} placeholder="Chapter" />
            <input value={scene} onChange={e => setScene(e.target.value)} placeholder="Scene title" />
          </div>

          <textarea
            value={sceneNotes}
            onChange={e => setSceneNotes(e.target.value)}
            placeholder="What happened in this scene?"
          />

          <button className="primaryButton" onClick={handleAddWhereUsed}>
            Add Scene Use
          </button>

          {character.whereUsed.map(entry => (
            <div key={entry.id} className="whereCard">
              <h4>Chapter {entry.chapter || '?'}</h4>
              <p><strong>Scene:</strong> {entry.scene}</p>
              <p><strong>Notes:</strong> {entry.notes}</p>
              <button onClick={() => onDeleteWhereUsed(entry.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* Relationships tab */}
      {activeTab === 'relationships' && (
        <div className="sectionCard">
          <h3>Relationship Mapping</h3>

          <textarea
            value={character.relationships || ''}
            onChange={e => onUpdateCharacter('relationships', e.target.value)}
            placeholder="Family, enemies, love interests, allies..."
          />

          <p className="emptyText">Future upgrade: visual relationship map.</p>
        </div>
      )}

      {/* Timeline tab */}
      {activeTab === 'timeline' && (
        <div className="sectionCard">
          <h3>Timeline</h3>
          <p className="emptyText">
            Future upgrade: track important character events across chapters.
          </p>
        </div>
      )}

      {/* AI tab */}
      {activeTab === 'ai' && (
        <div className="sectionCard">
          <h3>AI-Assisted Writing Tools</h3>

          <button className="primaryButton" onClick={generateSummary}>
            Generate Character Summary
          </button>

          {aiOutput && <div className="aiBox">{aiOutput}</div>}

          <p className="emptyText">
            Future upgrade: connect backend API for real AI writing assistance.
          </p>
        </div>
      )}
    </section>
  )
}

export default CharacterProfile