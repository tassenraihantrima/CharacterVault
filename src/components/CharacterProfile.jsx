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

    // Stores the generated writing-assistant result.
    const [aiOutput, setAiOutput] = useState('')

    // Tracks whether the local generator is currently running.
    const [isGenerating, setIsGenerating] = useState(false)

    // Stores a small validation or status message for the AI panel.
    const [aiMessage, setAiMessage] = useState('')

    /*
     * Whenever the selected character changes, clear temporary UI values.
     * Without this effect, an AI result generated for one character could remain visible after the user selects a different character.
     */
    useEffect(() => {
        setAiOutput('')
        setAiInstructions('')
        setAiMessage('')
        setNewTag('')
    }, [character?.id])

    // If no character is selected, display the existing empty state.
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
     * Returns a cleaned value for character information.
     */
    function getCharacterValue(value, fallback) {
        if (typeof value !== 'string') {
            return fallback
        }

        const cleanedValue = value.trim()

        return cleanedValue || fallback
    }

    /*
     * Returns the character's tags as a readable sentence.
     */
    function getTagText() {
        const tags = character.tags || []

        if (tags.length === 0) {
            return 'No custom tags have been added.'
        }

        return tags.join(', ')
    }

    /*
     * Returns a readable description of the character's relationships.
     */
    function getRelationshipText() {
        const relationships = character.relationships || []

        if (relationships.length === 0) {
            return 'No relationships have been recorded.'
        }

        return relationships
            .map(relationship => {
                const name =
                    relationship.relatedName || 'Unnamed character'

                const type =
                    relationship.type || 'unspecified relationship'

                return `${name} (${type})`
            })
            .join(', ')
    }

    /*
     * Returns a readable list of major timeline events.
     */
    function getTimelineText() {
        const timeline = character.timeline || []

        if (timeline.length === 0) {
            return 'No timeline events have been recorded.'
        }

        return timeline
            .slice(0, 4)
            .map(event => {
                const title = event.event || 'Untitled event'
                const chapter = event.chapter
                    ? `Chapter ${event.chapter}`
                    : 'Unknown chapter'

                return `${title} — ${chapter}`
            })
            .join('; ')
    }

    /*
     * Handles image uploads for the selected character.
     */
    function handlePortraitUpload(event) {
        // Get the first selected file.
        const file = event.target.files[0]

        // Stop if no image was selected.
        if (!file) return

        // Create a FileReader to convert the image into a Base64 string.
        const reader = new FileReader()

        // This function runs after the file has been converted.
        reader.onloadend = () => {
            onUpdateCharacter('portrait', reader.result)
        }

        // Begin reading the file.
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
            chapter,
            scene,
            notes: sceneNotes
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
            relatedName,
            type: relationshipType,
            notes: relationshipNotes
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

    /*
     * Adds one custom tag to the selected character.
     */
    function handleAddTag() {
        const cleanedTag = newTag.trim()

        // Do not add an empty tag.
        if (!cleanedTag) return

        const currentTags = character.tags || []

        // Check for an existing tag while ignoring capitalization.
        const duplicateExists = currentTags.some(
            tag => tag.toLowerCase() === cleanedTag.toLowerCase()
        )

        if (duplicateExists) {
            setNewTag('')
            return
        }

        // Save a new tags array through the existing update function.
        onUpdateCharacter('tags', [...currentTags, cleanedTag])

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
     * Produces a local character summary.
     * This does not call an external AI service yet. 
     * The purpose for now is to build the writing-assistant interface and organize generation logic.
     */
    function createCharacterSummary() {
        const name = getCharacterValue(
            character.name,
            'This unnamed character'
        )

        const role = getCharacterValue(
            character.role,
            'an undefined role'
        )

        const age = getCharacterValue(
            character.age,
            'an unspecified age'
        )

        const personality = getCharacterValue(
            character.personality,
            'Their personality has not been fully developed.'
        )

        const goal = getCharacterValue(
            character.goal,
            'Their central goal has not been defined.'
        )

        const conflict = getCharacterValue(
            character.conflict,
            'Their main conflict has not been defined.'
        )

        return `${name} is ${role} and is currently described as being ${age}. ${personality} ${goal} ${conflict} Character tags: ${getTagText()}`
    }

    /*
     * Produces a structured personality analysis.
     */
    function createPersonalityAnalysis() {
        const personality = getCharacterValue(
            character.personality,
            'No personality description is available.'
        )

        const goal = getCharacterValue(
            character.goal,
            'No central goal has been recorded.'
        )

        const conflict = getCharacterValue(
            character.conflict,
            'No main conflict has been recorded.'
        )

        return `PERSONALITY OVERVIEW

${personality}

POSSIBLE STRENGTH

This character may appear determined because their behavior can be connected to the following goal: ${goal}

POSSIBLE WEAKNESS

Their strongest weakness may develop from the pressure created by this conflict: ${conflict}

WRITING QUESTION

What personal belief causes this character to make difficult choices, even when a safer option is available?`
    }

    /*
     * Produces improvement suggestions based on incomplete profile fields.
     */
    function createImprovementSuggestions() {
        const suggestions = []

        if (!character.personality?.trim()) {
            suggestions.push(
                'Add specific personality traits instead of only broad labels.'
            )
        }

        if (!character.goal?.trim()) {
            suggestions.push(
                'Give the character a clear goal that can be achieved or lost.'
            )
        }

        if (!character.conflict?.trim()) {
            suggestions.push(
                'Add an internal or external conflict that prevents easy success.'
            )
        }

        if (!character.notes?.trim()) {
            suggestions.push(
                'Use the notes field to record secrets, habits, fears, or contradictions.'
            )
        }

        if ((character.relationships || []).length === 0) {
            suggestions.push(
                'Add at least one meaningful relationship that changes the character.'
            )
        }

        if ((character.timeline || []).length === 0) {
            suggestions.push(
                'Add timeline events to show how the character changes throughout the novel.'
            )
        }

        if ((character.tags || []).length === 0) {
            suggestions.push(
                'Add tags to describe the character’s function, themes, or important traits.'
            )
        }

        if (suggestions.length === 0) {
            suggestions.push(
                'The profile contains strong foundational details. Focus next on contradictions, consequences, and gradual character change.'
            )
        }

        return `CHARACTER IMPROVEMENT IDEAS

${suggestions
                .map((suggestion, index) => `${index + 1}. ${suggestion}`)
                .join('\n')}`
    }

    /*
     * Produces a short dialogue sample.
     */
    function createDialogueSample() {
        const name = getCharacterValue(
            character.name,
            'Character'
        )

        const goal = getCharacterValue(
            character.goal,
            'something important'
        )

        const conflict = getCharacterValue(
            character.conflict,
            'the problem standing in their way'
        )

        const relationship =
            (character.relationships || [])[0]

        const otherCharacter =
            relationship?.relatedName || 'Another Character'

        return `${name}: "I did not come this far to walk away from ${goal}."

${otherCharacter}: "And what happens when ${conflict} costs more than you expected?"

${name}: "Then I will decide what matters more—the life I planned or the person I became while fighting for it."

Writing note: Rewrite the sample to match the character's age, setting, speaking style, and relationship dynamics.`
    }

    /*
     * Produces several possible story-arc directions.
     */
    function createStoryArcIdeas() {
        const name = getCharacterValue(
            character.name,
            'The character'
        )

        const goal = getCharacterValue(
            character.goal,
            'their central goal'
        )

        const conflict = getCharacterValue(
            character.conflict,
            'their central conflict'
        )

        return `POSSIBLE STORY ARCS FOR ${name.toUpperCase()}

1. Growth Arc

${name} begins by pursuing ${goal}, but eventually realizes that overcoming ${conflict} requires changing a deeply held belief.

2. Fall Arc

${name} becomes increasingly obsessed with ${goal}. Their attempts to defeat ${conflict} gradually damage their relationships and sense of identity.

3. Revelation Arc

New information changes how ${name} understands ${goal}. The character must decide whether the original goal is still worth pursuing.

4. Sacrifice Arc

${name} gets close to achieving ${goal}, but must give it up to protect someone or prevent a greater consequence.`
    }

    /*
     * Produces a relationship analysis from saved relationship data.
     */
    function createRelationshipAnalysis() {
        const relationships = character.relationships || []

        if (relationships.length === 0) {
            return `RELATIONSHIP ANALYSIS

No relationships have been recorded for this character.

Add at least one relationship with a type and notes so the writing assistant can produce a more useful analysis.`
        }

        const relationshipDetails = relationships
            .map((relationship, index) => {
                const name =
                    relationship.relatedName ||
                    'Unnamed character'

                const type =
                    relationship.type ||
                    'unspecified relationship'

                const notes =
                    relationship.notes ||
                    'No relationship notes have been added.'

                return `${index + 1}. ${name}
Type: ${type}
Notes: ${notes}`
            })
            .join('\n\n')

        return `RELATIONSHIP ANALYSIS

${relationshipDetails}

WRITING QUESTIONS

- Which relationship has the greatest power imbalance?
- Which relationship changes the most during the novel?
- What does this character hide from the people closest to them?
- Which relationship creates the strongest emotional consequence?`
    }

    /*
     * Produces a backstory framework.
     */
    function createBackstoryIdeas() {
        const personality = getCharacterValue(
            character.personality,
            'their current personality'
        )

        const goal = getCharacterValue(
            character.goal,
            'their present goal'
        )

        const conflict = getCharacterValue(
            character.conflict,
            'their main conflict'
        )

        return `BACKSTORY FRAMEWORK

FORMATIVE EXPERIENCE

Create a past event that explains part of ${personality}.

ORIGIN OF THE GOAL

Describe the first moment when ${character.name || 'this character'} began wanting ${goal}.

PAST FAILURE

Give the character an earlier failure connected to ${conflict}. This failure can explain why the present conflict feels personal.

HIDDEN DETAIL

Add one secret the character believes would change how others see them.

UNRESOLVED CONNECTION

Connect the backstory to one current relationship so the past continues affecting the present story.`
    }

    /*
     * Produces conflict ideas using the character's current profile.
     */
    function createConflictIdeas() {
        const goal = getCharacterValue(
            character.goal,
            'their central goal'
        )

        const currentConflict = getCharacterValue(
            character.conflict,
            'their existing conflict'
        )

        return `CONFLICT IDEAS

1. External Conflict

A person or system gains the power to prevent the character from achieving ${goal}.

2. Internal Conflict

The character realizes that achieving ${goal} may require becoming someone they do not respect.

3. Relationship Conflict

A trusted person supports the goal but disagrees with the character's methods.

4. Escalation

The current conflict—${currentConflict}—creates a second problem that is more personal and harder to reverse.

5. Impossible Choice

The character must choose between the goal and protecting an important relationship.`
    }

    /*
     * Produces a basic timeline consistency review.
     */
    function createTimelineReview() {
        const timeline = character.timeline || []

        if (timeline.length === 0) {
            return `TIMELINE REVIEW

No timeline events have been recorded.

Add chapters, ages, event descriptions, and notes before checking the character's development timeline.`
        }

        const timelineDetails = timeline
            .map((event, index) => {
                const chapter =
                    event.chapter || 'Unknown chapter'

                const age =
                    event.age || 'Unknown age'

                const title =
                    event.event || 'Untitled event'

                return `${index + 1}. Chapter: ${chapter}
Age: ${age}
Event: ${title}`
            })
            .join('\n\n')

        return `TIMELINE REVIEW

${timelineDetails}

MANUAL CONSISTENCY CHECK

- Confirm that chapter numbers appear in the correct order.
- Confirm that the character's age changes logically.
- Check whether major emotional changes have enough development.
- Check whether later behavior reflects earlier timeline events.
- Add missing transition events where the character changes suddenly.`
    }

    /*
     * Chooses the correct local generator based on the selected tool.
     */
    function buildAiOutput() {
        switch (selectedAiTool) {
            case 'summary':
                return createCharacterSummary()

            case 'personality':
                return createPersonalityAnalysis()

            case 'improvements':
                return createImprovementSuggestions()

            case 'dialogue':
                return createDialogueSample()

            case 'storyArc':
                return createStoryArcIdeas()

            case 'relationships':
                return createRelationshipAnalysis()

            case 'backstory':
                return createBackstoryIdeas()

            case 'conflict':
                return createConflictIdeas()

            case 'timeline':
                return createTimelineReview()

            default:
                return createCharacterSummary()
        }
    }

    /*
     * Runs the selected writing assistant.
     * A short timeout creates a visible loading state. This also prepares the UI
     * for next update, when generation will become an asynchronous API request.
     */
    function handleGenerateAiOutput() {
        setIsGenerating(true)
        setAiMessage('')
        setAiOutput('')

        window.setTimeout(() => {
            const generatedOutput = buildAiOutput()

            const instructions = aiInstructions.trim()

            const finalOutput = instructions
                ? `${generatedOutput}

CUSTOM WRITER INSTRUCTIONS

${instructions}

Note: Real AI instruction handling will be added when the backend API is connected.`
                : generatedOutput

            setAiOutput(finalOutput)
            setIsGenerating(false)
            setAiMessage('Writing assistant output generated.')
        }, 500)
    }

    /*
     * Clears the current writing-assistant output and instructions.
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
            setAiMessage('Output copied to clipboard.')
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
                {/* Show the portrait when available. */}
                {character.portrait ? (
                    <img
                        src={character.portrait}
                        alt={`${character.name} portrait`}
                        className="portraitImage"
                    />
                ) : (
                    /*
                     * Show the first letter of the character's name when no
                     * portrait has been uploaded.
                     */
                    <div className="largeAvatar">
                        {character.name
                            ? character.name[0].toUpperCase()
                            : '?'}
                    </div>
                )}

                <div className="profileHeaderContent">
                    <h2>
                        {character.name || 'Unnamed Character'}
                    </h2>

                    <p>{character.role || 'No role yet'}</p>

                    {/* Preview the first few character tags. */}
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

            {/* Character profile navigation tabs */}
            <div className="tabs">
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
                    onClick={() => setActiveTab('tags')}
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
                    onClick={() => setActiveTab('ai')}
                >
                    AI Tools
                </button>
            </div>

            {/* Profile tab */}
            {activeTab === 'profile' && (
                <>
                    <div className="sectionCard">
                        <h3>General</h3>

                        <label>Name</label>

                        <input
                            value={character.name || ''}
                            onChange={event =>
                                onUpdateCharacter(
                                    'name',
                                    event.target.value
                                )
                            }
                        />

                        <label>Role</label>

                        <input
                            value={character.role || ''}
                            onChange={event =>
                                onUpdateCharacter(
                                    'role',
                                    event.target.value
                                )
                            }
                        />

                        <label>Age</label>

                        <input
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

                        <label>Personality</label>

                        <textarea
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

                        <label>Goal</label>

                        <textarea
                            value={character.goal || ''}
                            onChange={event =>
                                onUpdateCharacter(
                                    'goal',
                                    event.target.value
                                )
                            }
                        />

                        <label>Conflict</label>

                        <textarea
                            value={character.conflict || ''}
                            onChange={event =>
                                onUpdateCharacter(
                                    'conflict',
                                    event.target.value
                                )
                            }
                        />

                        <label>Notes</label>

                        <textarea
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
                                    <strong>Scene:</strong>{' '}
                                    {entry.scene}
                                </p>

                                <p>
                                    <strong>Notes:</strong>{' '}
                                    {entry.notes}
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
                                    Drag the characters, zoom,
                                    and explore their
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
                        onClick={handleAddTimelineEvent}
                    >
                        Add Timeline Event
                    </button>

                    {(character.timeline || []).map(event => (
                        <div
                            key={event.id}
                            className="timelineCard"
                        >
                            <h4>
                                {event.event ||
                                    'Untitled Event'}
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
                                {event.notes}
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
                    ))}
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
                                setNewTag(event.target.value)
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
                            {(character.tags || []).map(tag => (
                                <span
                                    key={tag}
                                    className="editableTagBadge"
                                >
                                    {tag}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteTag(tag)
                                        }
                                        aria-label={`Remove ${tag} tag`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="emptyText">
                            No tags have been added yet.
                        </p>
                    )}
                </div>
            )}

            {/* AI Writing Assistant tab */}
            {activeTab === 'ai' && (
                <div className="sectionCard aiAssistantCard">
                    <div className="aiAssistantHeader">
                        <div>
                            <span className="aiEyebrow">
                                Phase 17
                            </span>

                            <h3>AI Writing Assistant</h3>

                            <p>
                                Use the selected character's
                                saved information to generate
                                writing ideas and development
                                prompts.
                            </p>
                        </div>

                        <span className="localGeneratorBadge">
                            Local Generator
                        </span>
                    </div>

                    <div className="aiWorkspace">
                        {/* Left side: writing-tool controls */}
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
                                placeholder="Example: Make the ideas darker, focus on romance, or use a fantasy setting."
                            />

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
                                    disabled={
                                        isGenerating &&
                                        !aiOutput
                                    }
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
                                </ul>
                            </div>
                        </div>

                        {/* Right side: generated writing output */}
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
                                        Reviewing character
                                        information...
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
                                        Select a writing tool and
                                        click Generate to create
                                        ideas for this character.
                                    </p>
                                </div>
                            )}

                            {aiMessage && (
                                <p className="aiStatusMessage">
                                    {aiMessage}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="aiNotice">
                        <strong>Current version:</strong>{' '}
                        These outputs are created locally from
                        saved character data. A real AI API will
                        be connected through the backend in
                        Phase 19.
                    </div>
                </div>
            )}
        </section>
    )
}

export default CharacterProfile