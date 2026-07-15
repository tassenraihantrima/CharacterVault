import { useState } from 'react'

function CharacterProfile({
  character,
  onUpdateCharacter,
  onAddWhereUsed,
  onDeleteWhereUsed,
  onAddRelationship,
  onDeleteRelationship,
  onAddTimelineEvent,
  onDeleteTimelineEvent
}) {
  // Controls which tab is open
  const [activeTab, setActiveTab] = useState('profile')

  // Inputs for Where Used
  const [chapter, setChapter] = useState('')
  const [scene, setScene] = useState('')
  const [sceneNotes, setSceneNotes] = useState('')

  // Inputs for Relationships
  const [relatedName, setRelatedName] = useState('')
  const [relationshipType, setRelationshipType] = useState('')
  const [relationshipNotes, setRelationshipNotes] = useState('')

  // Inputs for Timeline
  const [timelineChapter, setTimelineChapter] = useState('')
  const [timelineAge, setTimelineAge] = useState('')
  const [timelineEvent, setTimelineEvent] = useState('')
  const [timelineNotes, setTimelineNotes] = useState('')

  // Placeholder output for future AI tools
  const [aiOutput, setAiOutput] = useState('')

  // If no character is selected, show empty state
  if (!character) {
    return (
      <section className="panel profilePanel">
        <h2>Character Profile</h2>
        <p className="emptyText">Select a character to view and edit details.</p>
      </section>
    )
  }

  // Handles image upload
  function handlePortraitUpload(event) {
    // Get the first uploaded file
    const file = event.target.files[0]

    // If user did not choose a file, stop
    if (!file) return

    // FileReader converts the image into a Base64 string
    const reader = new FileReader()

    // This runs after the file is converted
    reader.onloadend = () => {
      // Save the image string inside the selected character
      onUpdateCharacter('portrait', reader.result)
    }

    // Start reading the image file
    reader.readAsDataURL(file)
  }

  // Removes uploaded portrait
  function removePortrait() {
    onUpdateCharacter('portrait', '')
  }

  // Adds a chapter/scene reference
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

  // Adds relationship entry
  function handleAddRelationship() {
    if (!relatedName.trim() && !relationshipType.trim() && !relationshipNotes.trim()) return

    onAddRelationship({
      relatedName,
      type: relationshipType,
      notes: relationshipNotes
    })

    setRelatedName('')
    setRelationshipType('')
    setRelationshipNotes('')
  }

  // Adds timeline event
  function handleAddTimelineEvent() {
    if (
      !timelineChapter.trim() &&
      !timelineAge.trim() &&
      !timelineEvent.trim() &&
      !timelineNotes.trim()
    ) {
      return
    }

    onAddTimelineEvent({
      chapter: timelineChapter,
      age: timelineAge,
      event: timelineEvent,
      notes: timelineNotes
    })

    setTimelineChapter('')
    setTimelineAge('')
    setTimelineEvent('')
    setTimelineNotes('')
  }

  // Temporary AI-style summary without real API yet
  function generateSummary() {
    const summary = `${character.name} is a ${character.role || 'character'} whose goal is ${
      character.goal || 'not defined yet'
    }. Their main conflict is ${character.conflict || 'not defined yet'}.`

    setAiOutput(summary)
  }

  return (
    <section className="panel profilePanel">
      {/* Profile header */}
      <div className="profileHeader">
        {/* If portrait exists, show image. Otherwise show first letter avatar. */}
        {character.portrait ? (
          <img
            src={character.portrait}
            alt={`${character.name} portrait`}
            className="portraitImage"
          />
        ) : (
          <div className="largeAvatar">
            {character.name ? character.name[0].toUpperCase() : '?'}
          </div>
        )}

        <div>
          <h2>{character.name || 'Unnamed Character'}</h2>
          <p>{character.role || 'No role yet'}</p>
        </div>
      </div>

      {/* Portrait upload controls */}
      <div className="portraitControls">
        <label className="uploadButton">
          Upload Portrait
          <input
            type="file"
            accept="image/*"
            onChange={handlePortraitUpload}
          />
        </label>

        {character.portrait && (
          <button onClick={removePortrait}>
            Remove Portrait
          </button>
        )}
      </div>

      {/* Tabs */}
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

          {(character.whereUsed || []).map(entry => (
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

          <input
            value={relatedName}
            onChange={e => setRelatedName(e.target.value)}
            placeholder="Related character name"
          />

          <input
            value={relationshipType}
            onChange={e => setRelationshipType(e.target.value)}
            placeholder="Relationship type, e.g. sister, enemy, love interest"
          />

          <textarea
            value={relationshipNotes}
            onChange={e => setRelationshipNotes(e.target.value)}
            placeholder="Relationship notes"
          />

          <button className="primaryButton" onClick={handleAddRelationship}>
            Add Relationship
          </button>

          {(character.relationships || []).map(relationship => (
            <div key={relationship.id} className="relationshipCard">
              <h4>{relationship.relatedName || 'Unnamed Character'}</h4>
              <p><strong>Type:</strong> {relationship.type}</p>
              <p><strong>Notes:</strong> {relationship.notes}</p>
              <button onClick={() => onDeleteRelationship(relationship.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* Timeline tab */}
      {activeTab === 'timeline' && (
        <div className="sectionCard">
          <h3>Character Timeline</h3>

          <div className="formGrid">
            <input
              value={timelineChapter}
              onChange={e => setTimelineChapter(e.target.value)}
              placeholder="Chapter"
            />

            <input
              value={timelineAge}
              onChange={e => setTimelineAge(e.target.value)}
              placeholder="Character age"
            />
          </div>

          <input
            value={timelineEvent}
            onChange={e => setTimelineEvent(e.target.value)}
            placeholder="Major story event"
          />

          <textarea
            value={timelineNotes}
            onChange={e => setTimelineNotes(e.target.value)}
            placeholder="Describe what happened during this event"
          />

          <button className="primaryButton" onClick={handleAddTimelineEvent}>
            Add Timeline Event
          </button>

          {(character.timeline || []).map(event => (
            <div key={event.id} className="timelineCard">
              <h4>{event.event || 'Untitled Event'}</h4>
              <p><strong>Chapter:</strong> {event.chapter || 'N/A'}</p>
              <p><strong>Age:</strong> {event.age || 'N/A'}</p>
              <p><strong>Notes:</strong> {event.notes}</p>
              <button onClick={() => onDeleteTimelineEvent(event.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* AI Tools tab */}
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