import { useEffect, useState } from 'react'
import RelationshipGraph from './RelationshipGraph'

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
    // Controls which character-profile tab is currently visible
    const [activeTab, setActiveTab] = useState('profile')

    const [chapter, setChapter] = useState('')
    const [scene, setScene] = useState('')
    const [sceneNotes, setSceneNotes] = useState('')

    const [relatedName, setRelatedName] = useState('')
    const [relationshipType, setRelationshipType] = useState('')
    const [relationshipNotes, setRelationshipNotes] = useState('')

    const [timelineChapter, setTimelineChapter] = useState('')
    const [timelineAge, setTimelineAge] = useState('')
    const [timelineEvent, setTimelineEvent] = useState('')
    const [timelineNotes, setTimelineNotes] = useState('')

    // Stores the new tag currently being typed
    const [newTag, setNewTag] = useState('')

    // Stores a validation message for duplicate or empty tags
    const [tagMessage, setTagMessage] = useState('')

    // Stores the temporary locally generated character summary
    const [aiOutput, setAiOutput] = useState('')

    /*
      Return to the Profile tab whenever a different character
      is selected.
    */
    useEffect(() => {
        setActiveTab('profile')
        setNewTag('')
        setTagMessage('')
        setAiOutput('')
    }, [character?.id])

    // Display instructions when no character has been selected
    if (!character) {
        return (
            <section className="panel profilePanel">
                <h2>Character Profile</h2>

                <p className="emptyText">
                    Select a character to view and edit details.
                </p>
            </section>
        )
    }

    // Handles a character portrait upload
    function handlePortraitUpload(event) {
        // Retrieve the first uploaded file
        const file = event.target.files[0]

        // Stop when no file was selected
        if (!file) return

        /*
          FileReader converts the selected image into a Base64
          string that can be stored inside LocalStorage.
        */
        const reader = new FileReader()

        // Save the converted image after FileReader finishes
        reader.onloadend = () => {
            onUpdateCharacter('portrait', reader.result)
        }

        // Begin converting the image
        reader.readAsDataURL(file)
    }

    // Removes the saved character portrait
    function removePortrait() {
        onUpdateCharacter('portrait', '')
    }

    /*
      Adds one new tag to the selected character.
    */
    function handleAddTag() {
        // Remove spaces from the beginning and end
        const cleanedTag = newTag.trim()

        // Do not save an empty tag
        if (!cleanedTag) {
            setTagMessage('Enter a tag before adding it.')
            return
        }

        // Safely retrieve the current tags from old and new characters
        const currentTags = character.tags || []

        /*
          Check whether the character already has this tag.
        */
        const tagAlreadyExists = currentTags.some(
            tag => tag.toLowerCase() === cleanedTag.toLowerCase()
        )

        // Stop duplicate tags from being added
        if (tagAlreadyExists) {
            setTagMessage('This character already has that tag.')
            return
        }

        // Save the updated tags array through App.jsx
        onUpdateCharacter('tags', [
            ...currentTags,
            cleanedTag
        ])

        // Clear the input and validation message
        setNewTag('')
        setTagMessage('')
    }

    /*
      Allows the Enter key to add a tag without submitting or
      refreshing the page.
    */
    function handleTagKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleAddTag()
        }
    }

    /*
      Removes one tag from the selected character.
    */
    function handleDeleteTag(tagToDelete) {
        // Keep every tag except the clicked tag
        const updatedTags = (character.tags || []).filter(
            tag => tag !== tagToDelete
        )

        // Save the updated tag array
        onUpdateCharacter('tags', updatedTags)

        // Remove any old validation message
        setTagMessage('')
    }

    // Adds a new chapter and scene appearance
    function handleAddWhereUsed() {
        // Require at least one completed field
        if (
            !chapter.trim() &&
            !scene.trim() &&
            !sceneNotes.trim()
        ) {
            return
        }

        // Send the entry to App.jsx
        onAddWhereUsed({
            chapter: chapter.trim(),
            scene: scene.trim(),
            notes: sceneNotes.trim()
        })

        // Clear the form
        setChapter('')
        setScene('')
        setSceneNotes('')
    }

    // Adds a new relationship to the selected character
    function handleAddRelationship() {
        // Require at least one completed field
        if (
            !relatedName.trim() &&
            !relationshipType.trim() &&
            !relationshipNotes.trim()
        ) {
            return
        }

        // Send the relationship to App.jsx
        onAddRelationship({
            relatedName: relatedName.trim(),
            type: relationshipType.trim(),
            notes: relationshipNotes.trim()
        })

        // Clear the relationship form
        setRelatedName('')
        setRelationshipType('')
        setRelationshipNotes('')
    }

    // Adds a new event to the selected character's timeline
    function handleAddTimelineEvent() {
        // Require at least one completed field
        if (
            !timelineChapter.trim() &&
            !timelineAge.trim() &&
            !timelineEvent.trim() &&
            !timelineNotes.trim()
        ) {
            return
        }

        // Send the timeline event to App.jsx
        onAddTimelineEvent({
            chapter: timelineChapter.trim(),
            age: timelineAge.trim(),
            event: timelineEvent.trim(),
            notes: timelineNotes.trim()
        })

        // Clear the timeline form
        setTimelineChapter('')
        setTimelineAge('')
        setTimelineEvent('')
        setTimelineNotes('')
    }

    /*
      This remains a local placeholder until the real AI backend
      is created in a later phase.
    */
    function generateSummary() {
        const tagsText =
            (character.tags || []).length > 0
                ? ` Important tags include ${(character.tags || []).join(', ')}.`
                : ''

        const summary = `${character.name || 'This character'
            } is a ${character.role || 'character'
            } whose goal is ${character.goal || 'not defined yet'
            }. Their main conflict is ${character.conflict || 'not defined yet'
            }.${tagsText}`

        setAiOutput(summary)
    }

    return (
        <section className="panel profilePanel">
            {/* Profile header */}
            <div className="profileHeader">
                {/* Display portrait or first-letter avatar */}
                {character.portrait ? (
                    <img
                        src={character.portrait}
                        alt={`${character.name} portrait`}
                        className="portraitImage"
                    />
                ) : (
                    <div className="largeAvatar">
                        {character.name
                            ? character.name[0].toUpperCase()
                            : '?'}
                    </div>
                )}

                <div className="profileHeaderDetails">
                    <h2>
                        {character.name || 'Unnamed Character'}
                    </h2>

                    <p>
                        {character.role || 'No role yet'}
                    </p>

                    {/* Small tag preview inside the profile header */}
                    {(character.tags || []).length > 0 && (
                        <div className="profileHeaderTags">
                            {(character.tags || [])
                                .slice(0, 4)
                                .map(tag => (
                                    <span
                                        key={tag}
                                        className="characterTag"
                                    >
                                        {tag}
                                    </span>
                                ))}

                            {(character.tags || []).length > 4 && (
                                <span className="moreTagsBadge">
                                    +{character.tags.length - 4}
                                </span>
                            )}
                        </div>
                    )}
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
                    <button
                        type="button"
                        onClick={removePortrait}
                    >
                        Remove Portrait
                    </button>
                )}
            </div>

            {/* Profile navigation tabs */}
            <div
                className="tabs"
                role="tablist"
                aria-label="Character profile sections"
            >
                <button
                    type="button"
                    className={
                        activeTab === 'profile'
                            ? 'activeTab'
                            : ''
                    }
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>

                <button
                    type="button"
                    className={
                        activeTab === 'tags'
                            ? 'activeTab'
                            : ''
                    }
                    onClick={() => setActiveTab('tags')}
                >
                    Tags ({(character.tags || []).length})
                </button>

                <button
                    type="button"
                    className={
                        activeTab === 'whereUsed'
                            ? 'activeTab'
                            : ''
                    }
                    onClick={() => setActiveTab('whereUsed')}
                >
                    Where Used
                </button>

                <button
                    type="button"
                    className={
                        activeTab === 'relationships'
                            ? 'activeTab'
                            : ''
                    }
                    onClick={() =>
                        setActiveTab('relationships')
                    }
                >
                    Relationships
                </button>

                <button
                    type="button"
                    className={
                        activeTab === 'timeline'
                            ? 'activeTab'
                            : ''
                    }
                    onClick={() => setActiveTab('timeline')}
                >
                    Timeline
                </button>

                <button
                    type="button"
                    className={
                        activeTab === 'ai'
                            ? 'activeTab'
                            : ''
                    }
                    onClick={() => setActiveTab('ai')}
                >
                    AI Tools
                </button>
            </div>

            {/* Profile tab */}
            {activeTab === 'profile' && (
                <>
                    {/* General information */}
                    <div className="sectionCard">
                        <h3>General</h3>

                        <label htmlFor="profileName">
                            Name
                        </label>

                        <input
                            id="profileName"
                            value={character.name || ''}
                            onChange={event =>
                                onUpdateCharacter(
                                    'name',
                                    event.target.value
                                )
                            }
                        />

                        <label htmlFor="profileRole">
                            Role
                        </label>

                        <input
                            id="profileRole"
                            value={character.role || ''}
                            onChange={event =>
                                onUpdateCharacter(
                                    'role',
                                    event.target.value
                                )
                            }
                        />

                        <label htmlFor="profileAge">
                            Age
                        </label>

                        <input
                            id="profileAge"
                            value={character.age || ''}
                            onChange={event =>
                                onUpdateCharacter(
                                    'age',
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    {/* Character-development information */}
                    <div className="sectionCard">
                        <h3>Story Development</h3>

                        <label htmlFor="profilePersonality">
                            Personality
                        </label>

                        <textarea
                            id="profilePersonality"
                            value={character.personality || ''}
                            onChange={event =>
                                onUpdateCharacter(
                                    'personality',
                                    event.target.value
                                )
                            }
                        />

                        <label htmlFor="profileGoal">
                            Goal
                        </label>

                        <textarea
                            id="profileGoal"
                            value={character.goal || ''}
                            onChange={event =>
                                onUpdateCharacter(
                                    'goal',
                                    event.target.value
                                )
                            }
                        />

                        <label htmlFor="profileConflict">
                            Conflict
                        </label>

                        <textarea
                            id="profileConflict"
                            value={character.conflict || ''}
                            onChange={event =>
                                onUpdateCharacter(
                                    'conflict',
                                    event.target.value
                                )
                            }
                        />

                        <label htmlFor="profileNotes">
                            Notes
                        </label>

                        <textarea
                            id="profileNotes"
                            value={character.notes || ''}
                            onChange={event =>
                                onUpdateCharacter(
                                    'notes',
                                    event.target.value
                                )
                            }
                        />
                    </div>
                </>
            )}

            {/* Tags tab */}
            {activeTab === 'tags' && (
                <div className="sectionCard">
                    <div className="tagSectionHeader">
                        <div>
                            <h3>Character Tags</h3>

                            <p>
                                Organize this character using custom
                                labels such as protagonist, villain,
                                family, or secret identity.
                            </p>
                        </div>

                        <span className="tagCountBadge">
                            {(character.tags || []).length}
                        </span>
                    </div>

                    {/* New-tag form */}
                    <label htmlFor="newProfileTag">
                        Add Tag
                    </label>

                    <div className="tagInputRow">
                        <input
                            id="newProfileTag"
                            type="text"
                            value={newTag}
                            onChange={event => {
                                setNewTag(event.target.value)
                                setTagMessage('')
                            }}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Example: secret identity"
                        />

                        <button
                            type="button"
                            className="tagAddButton"
                            onClick={handleAddTag}
                        >
                            Add Tag
                        </button>
                    </div>

                    <p className="inputHelpText">
                        Press Enter or select Add Tag.
                    </p>

                    {/* Tag validation feedback */}
                    {tagMessage && (
                        <p
                            className="tagMessage"
                            role="alert"
                        >
                            {tagMessage}
                        </p>
                    )}

                    {/* Saved tags */}
                    {(character.tags || []).length === 0 ? (
                        <div className="tagEmptyState">
                            <h4>No tags yet</h4>

                            <p>
                                Add tags to make this character easier
                                to organize, search, and filter.
                            </p>
                        </div>
                    ) : (
                        <div className="profileTagList">
                            {(character.tags || []).map(tag => (
                                <div
                                    key={tag}
                                    className="editableTag"
                                >
                                    <span>
                                        {tag}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteTag(tag)
                                        }
                                        aria-label={`Remove ${tag} tag`}
                                        title={`Remove ${tag}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Where Used tab */}
            {activeTab === 'whereUsed' && (
                <div className="sectionCard">
                    <h3>Scene / Chapter Tracking</h3>

                    <div className="formGrid">
                        <input
                            value={chapter}
                            onChange={event =>
                                setChapter(event.target.value)
                            }
                            placeholder="Chapter"
                        />

                        <input
                            value={scene}
                            onChange={event =>
                                setScene(event.target.value)
                            }
                            placeholder="Scene title"
                        />
                    </div>

                    <textarea
                        value={sceneNotes}
                        onChange={event =>
                            setSceneNotes(event.target.value)
                        }
                        placeholder="What happened in this scene?"
                    />

                    <button
                        type="button"
                        className="primaryButton"
                        onClick={handleAddWhereUsed}
                    >
                        Add Scene Use
                    </button>

                    {(character.whereUsed || []).length === 0 && (
                        <p className="emptyText">
                            No chapter or scene appearances recorded.
                        </p>
                    )}

                    {(character.whereUsed || []).map(entry => (
                        <div
                            key={entry.id}
                            className="whereCard"
                        >
                            <h4>
                                Chapter {entry.chapter || '?'}
                            </h4>

                            <p>
                                <strong>Scene:</strong>{' '}
                                {entry.scene || 'Not provided'}
                            </p>

                            <p>
                                <strong>Notes:</strong>{' '}
                                {entry.notes || 'No notes'}
                            </p>

                            <button
                                type="button"
                                className="deleteButton"
                                onClick={() =>
                                    onDeleteWhereUsed(entry.id)
                                }
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Relationships tab */}
            {activeTab === 'relationships' && (
                <div className="sectionCard">
                    <h3>Relationship Mapping</h3>

                    {/* Related character name */}
                    <input
                        value={relatedName}
                        onChange={event =>
                            setRelatedName(event.target.value)
                        }
                        placeholder="Related character name"
                    />

                    {/* Relationship type */}
                    <input
                        value={relationshipType}
                        onChange={event =>
                            setRelationshipType(event.target.value)
                        }
                        placeholder="Relationship type, e.g. sister, enemy, love interest"
                    />

                    {/* Relationship notes */}
                    <textarea
                        value={relationshipNotes}
                        onChange={event =>
                            setRelationshipNotes(event.target.value)
                        }
                        placeholder="Relationship notes"
                    />

                    <button
                        type="button"
                        className="primaryButton"
                        onClick={handleAddRelationship}
                    >
                        Add Relationship
                    </button>

                    {/* Existing relationship cards */}
                    <div className="relationshipList">
                        {(character.relationships || []).length === 0 && (
                            <p className="emptyText">
                                No relationships recorded.
                            </p>
                        )}

                        {(character.relationships || []).map(
                            relationship => (
                                <div
                                    key={relationship.id}
                                    className="relationshipCard"
                                >
                                    <div className="relationshipCardHeader">
                                        <div>
                                            <h4>
                                                {relationship.relatedName ||
                                                    'Unnamed Character'}
                                            </h4>

                                            <span className="relationshipType">
                                                {relationship.type ||
                                                    'Relationship not specified'}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="deleteButton"
                                            onClick={() =>
                                                onDeleteRelationship(
                                                    relationship.id
                                                )
                                            }
                                            aria-label={`Delete relationship with ${relationship.relatedName ||
                                                'character'
                                                }`}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {relationship.notes && (
                                        <p>
                                            {relationship.notes}
                                        </p>
                                    )}
                                </div>
                            )
                        )}
                    </div>

                    {/* Interactive relationship graph */}
                    <div className="relationshipGraphSection">
                        <div className="graphSectionHeader">
                            <div>
                                <h3>
                                    Visual Relationship Graph
                                </h3>

                                <p>
                                    Drag characters, zoom, and
                                    explore their connections.
                                </p>
                            </div>

                            <span className="relationshipCount">
                                {
                                    (character.relationships || [])
                                        .length
                                }
                            </span>
                        </div>

                        <RelationshipGraph
                            character={character}
                        />
                    </div>
                </div>
            )}

            {/* Timeline tab */}
            {activeTab === 'timeline' && (
                <div className="sectionCard">
                    <h3>Character Timeline</h3>

                    <div className="formGrid">
                        <input
                            value={timelineChapter}
                            onChange={event =>
                                setTimelineChapter(
                                    event.target.value
                                )
                            }
                            placeholder="Chapter"
                        />

                        <input
                            value={timelineAge}
                            onChange={event =>
                                setTimelineAge(event.target.value)
                            }
                            placeholder="Character age"
                        />
                    </div>

                    <input
                        value={timelineEvent}
                        onChange={event =>
                            setTimelineEvent(event.target.value)
                        }
                        placeholder="Major story event"
                    />

                    <textarea
                        value={timelineNotes}
                        onChange={event =>
                            setTimelineNotes(event.target.value)
                        }
                        placeholder="Describe what happened during this event"
                    />

                    <button
                        type="button"
                        className="primaryButton"
                        onClick={handleAddTimelineEvent}
                    >
                        Add Timeline Event
                    </button>

                    {(character.timeline || []).length === 0 && (
                        <p className="emptyText">
                            No timeline events recorded.
                        </p>
                    )}

                    {(character.timeline || []).map(event => (
                        <div
                            key={event.id}
                            className="timelineCard"
                        >
                            <h4>
                                {event.event || 'Untitled Event'}
                            </h4>

                            <p>
                                <strong>Chapter:</strong>{' '}
                                {event.chapter || 'N/A'}
                            </p>

                            <p>
                                <strong>Age:</strong>{' '}
                                {event.age || 'N/A'}
                            </p>

                            <p>
                                <strong>Notes:</strong>{' '}
                                {event.notes || 'No notes'}
                            </p>

                            <button
                                type="button"
                                className="deleteButton"
                                onClick={() =>
                                    onDeleteTimelineEvent(event.id)
                                }
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* AI Tools tab */}
            {activeTab === 'ai' && (
                <div className="sectionCard">
                    <h3>AI-Assisted Writing Tools</h3>

                    <button
                        type="button"
                        className="primaryButton"
                        onClick={generateSummary}
                    >
                        Generate Character Summary
                    </button>

                    {aiOutput && (
                        <div className="aiBox">
                            {aiOutput}
                        </div>
                    )}

                    <p className="emptyText">
                        A future phase will connect this tab to a
                        secure backend and a real AI API.
                    </p>
                </div>
            )}
        </section>
    )
}

export default CharacterProfile