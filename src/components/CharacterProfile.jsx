import { useEffect, useState } from 'react'
import RelationshipGraph from './RelationshipGraph'
import {
    generateAiWriting
} from '../services/aiApi'

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
    // Controls which profile tab is currently visible.
    const [activeTab, setActiveTab] = useState('profile')

    // Inputs used by the Where Used tab.
    const [chapter, setChapter] = useState('')
    const [scene, setScene] = useState('')
    const [sceneNotes, setSceneNotes] = useState('')

    // Inputs used by the Relationships tab.
    const [relatedName, setRelatedName] = useState('')
    const [relationshipType, setRelationshipType] = useState('')
    const [relationshipNotes, setRelationshipNotes] = useState('')

    // Inputs used by the Timeline tab.
    const [timelineChapter, setTimelineChapter] = useState('')
    const [timelineAge, setTimelineAge] = useState('')
    const [timelineEvent, setTimelineEvent] = useState('')
    const [timelineNotes, setTimelineNotes] = useState('')

    // Input used by the Tags tab.
    const [newTag, setNewTag] = useState('')

    // Stores the currently selected AI writing tool.
    const [selectedAiTool, setSelectedAiTool] = useState('summary')

    // Stores optional instructions entered by the writer.
    const [aiInstructions, setAiInstructions] = useState('')

    // Stores the generated AI writing result.
    const [aiOutput, setAiOutput] = useState('')

    // Tracks whether a real AI request is currently running.
    const [isGenerating, setIsGenerating] = useState(false)

    // Stores a validation, success, or error message for the AI panel.
    const [aiMessage, setAiMessage] = useState('')

    /*
     * Clear temporary interface values whenever the selected
     * character changes.
     *
     * This prevents AI output generated for one character from
     * remaining visible after another character is selected.
     */
    useEffect(() => {
        setAiOutput('')
        setAiInstructions('')
        setAiMessage('')
        setNewTag('')
    }, [character?.id])

    // Display the empty profile state when no character is selected.
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

    /*
     * Handles portrait uploads for the selected character.
     */
    function handlePortraitUpload(event) {
        // Get the first selected file.
        const file = event.target.files[0]

        // Stop if the user did not select a file.
        if (!file) return

        // Only allow image files.
        if (!file.type.startsWith('image/')) {
            return
        }

        // Convert the image into a Base64 string.
        const reader = new FileReader()

        reader.onloadend = () => {
            onUpdateCharacter('portrait', reader.result)
        }

        reader.readAsDataURL(file)
    }

    // Removes the selected character's portrait.
    function removePortrait() {
        onUpdateCharacter('portrait', '')
    }

    /*
     * Adds a chapter or scene appearance.
     */
    function handleAddWhereUsed() {
        if (
            !chapter.trim() &&
            !scene.trim() &&
            !sceneNotes.trim()
        ) {
            return
        }

        onAddWhereUsed({
            chapter: chapter.trim(),
            scene: scene.trim(),
            notes: sceneNotes.trim()
        })

        setChapter('')
        setScene('')
        setSceneNotes('')
    }

    /*
     * Adds a relationship to the selected character.
     */
    function handleAddRelationship() {
        if (
            !relatedName.trim() &&
            !relationshipType.trim() &&
            !relationshipNotes.trim()
        ) {
            return
        }

        onAddRelationship({
            relatedName: relatedName.trim(),
            type: relationshipType.trim(),
            notes: relationshipNotes.trim()
        })

        setRelatedName('')
        setRelationshipType('')
        setRelationshipNotes('')
    }

    /*
     * Adds a timeline event to the selected character.
     */
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
            chapter: timelineChapter.trim(),
            age: timelineAge.trim(),
            event: timelineEvent.trim(),
            notes: timelineNotes.trim()
        })

        setTimelineChapter('')
        setTimelineAge('')
        setTimelineEvent('')
        setTimelineNotes('')
    }

    /*
     * Adds one custom tag to the selected character.
     */
    function handleAddTag() {
        const cleanedTag = newTag.trim()

        // Do not add an empty tag.
        if (!cleanedTag) return

        const currentTags = character.tags || []

        /*
         * Prevent duplicate tags while ignoring capitalization.
         *
         * Example:
         * Hero and hero are treated as the same tag.
         */
        const duplicateExists = currentTags.some(
            tag =>
                tag.toLowerCase() ===
                cleanedTag.toLowerCase()
        )

        if (duplicateExists) {
            setNewTag('')
            return
        }

        // Save the updated tag array.
        onUpdateCharacter(
            'tags',
            [...currentTags, cleanedTag]
        )

        setNewTag('')
    }

    /*
     * Removes one custom tag from the selected character.
     */
    function handleDeleteTag(tagToDelete) {
        const updatedTags = (character.tags || []).filter(
            tag => tag !== tagToDelete
        )

        onUpdateCharacter('tags', updatedTags)
    }

    /*
     * Allows Enter to add a tag without clicking the button.
     */
    function handleTagKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleAddTag()
        }
    }

    /*
     * Requests real AI-generated writing from the Express backend.
     */
    async function handleGenerateAiOutput() {
        // Prevent duplicate requests while one request is running.
        if (isGenerating) return

        // Start the loading interface.
        setIsGenerating(true)

        // Clear the previous result and status message.
        setAiOutput('')
        setAiMessage('')

        try {
            /*
             * Send the selected writing tool, character profile,
             * and optional instructions to the backend.
             */
            const result = await generateAiWriting({
                tool: selectedAiTool,
                character,
                writerInstructions:
                    aiInstructions.trim()
            })

            // Display the generated response.
            setAiOutput(result.output)

            // Display the model used when the backend returns it.
            setAiMessage(
                result.model
                    ? `Generated with ${result.model}.`
                    : 'AI response generated successfully.'
            )
        } catch (error) {
            console.error(
                'Writing assistant request failed:',
                error
            )

            /*
             * Display a readable network or backend error
             * instead of allowing the component to crash.
             */
            setAiMessage(
                error.message ||
                'The writing assistant could not generate a response.'
            )
        } finally {
            // Stop the loading interface after success or failure.
            setIsGenerating(false)
        }
    }

    /*
     * Clears the current AI output and optional instructions.
     */
    function clearAiWorkspace() {
        setAiOutput('')
        setAiInstructions('')
        setAiMessage('')
    }

    /*
     * Copies the generated output to the clipboard.
     */
    async function copyAiOutput() {
        if (!aiOutput) return

        try {
            await navigator.clipboard.writeText(aiOutput)

            setAiMessage(
                'Output copied to clipboard.'
            )
        } catch {
            setAiMessage(
                'The browser could not copy the output automatically.'
            )
        }
    }

    return (
        <section className="panel profilePanel">
            {/* Selected character header */}
            <div className="profileHeader">
                {/* Display a portrait when one exists. */}
                {character.portrait ? (
                    <img
                        src={character.portrait}
                        alt={`${character.name || 'Character'} portrait`}
                        className="portraitImage"
                    />
                ) : (
                    /*
                     * Display the first letter of the character's
                     * name when no portrait has been uploaded.
                     */
                    <div className="largeAvatar">
                        {character.name
                            ? character.name[0].toUpperCase()
                            : '?'}
                    </div>
                )}

                <div className="profileHeaderContent">
                    <h2>
                        {character.name ||
                            'Unnamed Character'}
                    </h2>

                    <p>
                        {character.role ||
                            'No role yet'}
                    </p>

                    {/* Preview the first four tags. */}
                    {(character.tags || []).length > 0 && (
                        <div className="profileTagPreview">
                            {(character.tags || [])
                                .slice(0, 4)
                                .map(tag => (
                                    <span
                                        key={tag}
                                        className="tagBadge"
                                    >
                                        {tag}
                                    </span>
                                ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Portrait controls */}
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

            {/* Character profile tabs */}
            <div className="tabs">
                <button
                    type="button"
                    className={
                        activeTab === 'profile'
                            ? 'activeTab'
                            : ''
                    }
                    onClick={() =>
                        setActiveTab('profile')
                    }
                >
                    Profile
                </button>

                <button
                    type="button"
                    className={
                        activeTab === 'whereUsed'
                            ? 'activeTab'
                            : ''
                    }
                    onClick={() =>
                        setActiveTab('whereUsed')
                    }
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
                    onClick={() =>
                        setActiveTab('timeline')
                    }
                >
                    Timeline
                </button>

                <button
                    type="button"
                    className={
                        activeTab === 'tags'
                            ? 'activeTab'
                            : ''
                    }
                    onClick={() =>
                        setActiveTab('tags')
                    }
                >
                    Tags
                </button>

                <button
                    type="button"
                    className={
                        activeTab === 'ai'
                            ? 'activeTab'
                            : ''
                    }
                    onClick={() =>
                        setActiveTab('ai')
                    }
                >
                    AI Tools
                </button>
            </div>

            {/* Profile tab */}
            {activeTab === 'profile' && (
                <>
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

                    <div className="sectionCard">
                        <h3>Story Development</h3>

                        <label htmlFor="profilePersonality">
                            Personality
                        </label>

                        <textarea
                            id="profilePersonality"
                            value={
                                character.personality || ''
                            }
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
                            value={
                                character.conflict || ''
                            }
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

            {/* Where Used tab */}
            {activeTab === 'whereUsed' && (
                <div className="sectionCard">
                    <h3>Scene / Chapter Tracking</h3>

                    <div className="formGrid">
                        <input
                            value={chapter}
                            onChange={event =>
                                setChapter(
                                    event.target.value
                                )
                            }
                            placeholder="Chapter"
                        />

                        <input
                            value={scene}
                            onChange={event =>
                                setScene(
                                    event.target.value
                                )
                            }
                            placeholder="Scene title"
                        />
                    </div>

                    <textarea
                        value={sceneNotes}
                        onChange={event =>
                            setSceneNotes(
                                event.target.value
                            )
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

                    {(character.whereUsed || []).map(
                        entry => (
                            <div
                                key={entry.id}
                                className="whereCard"
                            >
                                <h4>
                                    Chapter{' '}
                                    {entry.chapter || '?'}
                                </h4>

                                <p>
                                    <strong>
                                        Scene:
                                    </strong>{' '}
                                    {entry.scene ||
                                        'Not provided'}
                                </p>

                                <p>
                                    <strong>
                                        Notes:
                                    </strong>{' '}
                                    {entry.notes ||
                                        'No notes'}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDeleteWhereUsed(
                                            entry.id
                                        )
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        )
                    )}
                </div>
            )}

            {/* Relationships tab */}
            {activeTab === 'relationships' && (
                <div className="sectionCard">
                    <h3>Relationship Mapping</h3>

                    <input
                        value={relatedName}
                        onChange={event =>
                            setRelatedName(
                                event.target.value
                            )
                        }
                        placeholder="Related character name"
                    />

                    <input
                        value={relationshipType}
                        onChange={event =>
                            setRelationshipType(
                                event.target.value
                            )
                        }
                        placeholder="Relationship type, e.g. sister, enemy, love interest"
                    />

                    <textarea
                        value={relationshipNotes}
                        onChange={event =>
                            setRelationshipNotes(
                                event.target.value
                            )
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

                    <div className="relationshipList">
                        {(character.relationships || []).map(
                            relationship => (
                                <div
                                    key={
                                        relationship.id
                                    }
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
                                            {
                                                relationship.notes
                                            }
                                        </p>
                                    )}
                                </div>
                            )
                        )}
                    </div>

                    <div className="relationshipGraphSection">
                        <div className="graphSectionHeader">
                            <div>
                                <h3>
                                    Visual Relationship Graph
                                </h3>

                                <p>
                                    Drag the characters,
                                    zoom, and explore their
                                    connections.
                                </p>
                            </div>

                            <span className="relationshipCount">
                                {
                                    (
                                        character.relationships ||
                                        []
                                    ).length
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
                                setTimelineAge(
                                    event.target.value
                                )
                            }
                            placeholder="Character age"
                        />
                    </div>

                    <input
                        value={timelineEvent}
                        onChange={event =>
                            setTimelineEvent(
                                event.target.value
                            )
                        }
                        placeholder="Major story event"
                    />

                    <textarea
                        value={timelineNotes}
                        onChange={event =>
                            setTimelineNotes(
                                event.target.value
                            )
                        }
                        placeholder="Describe what happened during this event"
                    />

                    <button
                        type="button"
                        className="primaryButton"
                        onClick={
                            handleAddTimelineEvent
                        }
                    >
                        Add Timeline Event
                    </button>

                    {(character.timeline || []).map(
                        event => (
                            <div
                                key={event.id}
                                className="timelineCard"
                            >
                                <h4>
                                    {event.event ||
                                        'Untitled Event'}
                                </h4>

                                <p>
                                    <strong>
                                        Chapter:
                                    </strong>{' '}
                                    {event.chapter ||
                                        'N/A'}
                                </p>

                                <p>
                                    <strong>
                                        Age:
                                    </strong>{' '}
                                    {event.age ||
                                        'N/A'}
                                </p>

                                <p>
                                    <strong>
                                        Notes:
                                    </strong>{' '}
                                    {event.notes ||
                                        'No notes'}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDeleteTimelineEvent(
                                            event.id
                                        )
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        )
                    )}
                </div>
            )}

            {/* Tags tab */}
            {activeTab === 'tags' && (
                <div className="sectionCard">
                    <h3>Character Tags</h3>

                    <p className="sectionDescription">
                        Add custom labels to organize this
                        character by story role, personality,
                        theme, or importance.
                    </p>

                    <div className="tagInputRow">
                        <input
                            value={newTag}
                            onChange={event =>
                                setNewTag(
                                    event.target.value
                                )
                            }
                            onKeyDown={handleTagKeyDown}
                            placeholder="Enter a new tag"
                        />

                        <button
                            type="button"
                            className="primaryButton"
                            onClick={handleAddTag}
                        >
                            Add Tag
                        </button>
                    </div>

                    {(character.tags || []).length > 0 ? (
                        <div className="editableTagList">
                            {(character.tags || []).map(
                                tag => (
                                    <span
                                        key={tag}
                                        className="editableTagBadge"
                                    >
                                        {tag}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteTag(
                                                    tag
                                                )
                                            }
                                            aria-label={`Remove ${tag} tag`}
                                        >
                                            ×
                                        </button>
                                    </span>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="emptyText">
                            No tags have been added yet.
                        </p>
                    )}
                </div>
            )}

            {/* Real AI Writing Assistant tab */}
            {activeTab === 'ai' && (
                <div className="sectionCard aiAssistantCard">
                    <div className="aiAssistantHeader">
                        <div>
                            <span className="aiEyebrow">
                                Phase 19
                            </span>

                            <h3>
                                AI Writing Assistant
                            </h3>

                            <p>
                                Use the selected character's
                                saved information to generate
                                context-aware writing ideas
                                and development assistance.
                            </p>
                        </div>

                        <span className="localGeneratorBadge">
                            Real AI
                        </span>
                    </div>

                    <div className="aiWorkspace">
                        {/* AI writing controls */}
                        <div className="aiControlPanel">
                            <label htmlFor="aiTool">
                                Choose Writing Tool
                            </label>

                            <select
                                id="aiTool"
                                value={selectedAiTool}
                                onChange={event => {
                                    setSelectedAiTool(
                                        event.target.value
                                    )

                                    setAiOutput('')
                                    setAiMessage('')
                                }}
                            >
                                <option value="summary">
                                    Character Summary
                                </option>

                                <option value="personality">
                                    Personality Analysis
                                </option>

                                <option value="improvements">
                                    Character Improvement
                                </option>

                                <option value="dialogue">
                                    Dialogue Generator
                                </option>

                                <option value="storyArc">
                                    Story Arc Ideas
                                </option>

                                <option value="relationships">
                                    Relationship Analysis
                                </option>

                                <option value="backstory">
                                    Backstory Generator
                                </option>

                                <option value="conflict">
                                    Conflict Generator
                                </option>

                                <option value="timeline">
                                    Timeline Review
                                </option>
                            </select>

                            <label htmlFor="aiInstructions">
                                Optional Instructions
                            </label>

                            <textarea
                                id="aiInstructions"
                                value={aiInstructions}
                                onChange={event =>
                                    setAiInstructions(
                                        event.target.value
                                    )
                                }
                                maxLength={2000}
                                placeholder="Example: Make the ideas darker, focus on romance, or use a fantasy setting."
                            />

                            <p className="inputHelpText">
                                {
                                    aiInstructions.length
                                }
                                /2000 characters
                            </p>

                            <div className="aiActionButtons">
                                <button
                                    type="button"
                                    className="primaryButton"
                                    onClick={
                                        handleGenerateAiOutput
                                    }
                                    disabled={isGenerating}
                                >
                                    {isGenerating
                                        ? 'Generating...'
                                        : 'Generate'}
                                </button>

                                <button
                                    type="button"
                                    onClick={clearAiWorkspace}
                                    disabled={isGenerating}
                                >
                                    Clear
                                </button>
                            </div>

                            <div className="aiCharacterContext">
                                <h4>
                                    Character Information Used
                                </h4>

                                <ul>
                                    <li>
                                        Profile details
                                    </li>

                                    <li>
                                        Goals and conflicts
                                    </li>

                                    <li>
                                        Custom tags
                                    </li>

                                    <li>
                                        Relationships
                                    </li>

                                    <li>
                                        Timeline events
                                    </li>

                                    <li>
                                        Chapter and scene appearances
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* AI-generated output */}
                        <div className="aiOutputPanel">
                            <div className="aiOutputHeader">
                                <div>
                                    <span className="aiOutputLabel">
                                        Generated Output
                                    </span>

                                    <h4>
                                        {character.name ||
                                            'Selected Character'}
                                    </h4>
                                </div>

                                {aiOutput && (
                                    <button
                                        type="button"
                                        className="copyOutputButton"
                                        onClick={copyAiOutput}
                                    >
                                        Copy
                                    </button>
                                )}
                            </div>

                            {isGenerating ? (
                                <div className="aiLoadingState">
                                    <div className="aiLoadingDots">
                                        <span />
                                        <span />
                                        <span />
                                    </div>

                                    <p>
                                        Generating a response
                                        with AI...
                                    </p>
                                </div>
                            ) : aiOutput ? (
                                <pre className="aiGeneratedText">
                                    {aiOutput}
                                </pre>
                            ) : (
                                <div className="aiEmptyState">
                                    <span className="aiEmptyIcon">
                                        ✦
                                    </span>

                                    <h4>
                                        No output generated yet
                                    </h4>

                                    <p>
                                        Select a writing tool
                                        and click Generate to
                                        request AI writing
                                        assistance.
                                    </p>
                                </div>
                            )}

                            {aiMessage && (
                                <p
                                    className="aiStatusMessage"
                                    role="status"
                                >
                                    {aiMessage}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="aiNotice">
                        <strong>
                            AI-powered version:
                        </strong>{' '}
                        Character data is sent to the
                        CharacterVault Express backend, which
                        securely requests a generated response
                        from the configured AI model.
                    </div>
                </div>
            )}
        </section>
    )
}

export default CharacterProfile