import OpenAI from 'openai'

/*
 * Create the OpenAI client on the backend.
 */
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

/*
 * Display names for each CharacterVault writing tool.
 */
const toolNames = {
    summary: 'Character Summary',
    personality: 'Personality Analysis',
    improvements: 'Character Improvement Suggestions',
    dialogue: 'Dialogue Generator',
    storyArc: 'Story Arc Ideas',
    relationships: 'Relationship Analysis',
    backstory: 'Backstory Generator',
    conflict: 'Conflict Generator',
    timeline: 'Timeline Review'
}

/*
 * Convert missing or invalid values into readable text.
 */
function cleanText(value, fallback = 'Not provided') {
    if (
        value === null ||
        value === undefined
    ) {
        return fallback
    }

    const cleanedValue = String(value).trim()

    return cleanedValue || fallback
}

/*
 * Convert saved tags into prompt text.
 */
function formatTags(tags) {
    if (!Array.isArray(tags) || tags.length === 0) {
        return 'No tags recorded.'
    }

    return tags
        .map(tag => cleanText(tag, 'Unnamed tag'))
        .join(', ')
}

/*
 * Convert saved relationships into prompt text.
 */
function formatRelationships(relationships) {
    if (
        !Array.isArray(relationships) ||
        relationships.length === 0
    ) {
        return 'No relationships recorded.'
    }

    return relationships
        .slice(0, 20)
        .map((relationship, index) => {
            const name = cleanText(
                relationship.relatedName,
                'Unnamed character'
            )

            const type = cleanText(
                relationship.type,
                'Unspecified relationship'
            )

            const notes = cleanText(
                relationship.notes,
                'No relationship notes'
            )

            return `${index + 1}. Character: ${name}
Relationship type: ${type}
Notes: ${notes}`
        })
        .join('\n\n')
}

/*
 * Convert saved timeline events into prompt text.
 */
function formatTimeline(timeline) {
    if (!Array.isArray(timeline) || timeline.length === 0) {
        return 'No timeline events recorded.'
    }

    return timeline
        .slice(0, 30)
        .map((timelineEvent, index) => {
            const eventName = cleanText(
                timelineEvent.event,
                'Untitled event'
            )

            const chapter = cleanText(
                timelineEvent.chapter,
                'Unknown chapter'
            )

            const age = cleanText(
                timelineEvent.age,
                'Unknown age'
            )

            const notes = cleanText(
                timelineEvent.notes,
                'No event notes'
            )

            return `${index + 1}. Event: ${eventName}
Chapter: ${chapter}
Character age: ${age}
Notes: ${notes}`
        })
        .join('\n\n')
}

/*
 * Convert chapter and scene appearances into prompt text.
 */
function formatAppearances(whereUsed) {
    if (!Array.isArray(whereUsed) || whereUsed.length === 0) {
        return 'No chapter or scene appearances recorded.'
    }

    return whereUsed
        .slice(0, 30)
        .map((appearance, index) => {
            const chapter = cleanText(
                appearance.chapter,
                'Unknown chapter'
            )

            const scene = cleanText(
                appearance.scene,
                'Unnamed scene'
            )

            const notes = cleanText(
                appearance.notes,
                'No appearance notes'
            )

            return `${index + 1}. Chapter: ${chapter}
Scene: ${scene}
Notes: ${notes}`
        })
        .join('\n\n')
}

/*
 * Return instructions for the selected writing tool.
 */
function buildToolInstructions(tool) {
    switch (tool) {
        case 'summary':
            return `
Write a polished character summary.

Include:
- the character's role in the story
- defining personality traits
- central motivation
- main conflict
- important relationships
- likely character-development direction

Do not simply repeat every profile field.
`

        case 'personality':
            return `
Analyze the character's personality.

Include:
- core personality traits
- emotional strengths
- emotional weaknesses
- contradictions
- likely fears or insecurities
- behavior under pressure
- questions the writer should answer
`

        case 'improvements':
            return `
Evaluate how well developed this character currently is.

Include:
- missing information
- weak or unclear motivations
- possible contradictions
- ways to make the character more believable
- ways to strengthen the conflict
- specific profile improvements

Be constructive and specific.
`

        case 'dialogue':
            return `
Write a short dialogue scene involving this character.

Requirements:
- natural dialogue
- distinct character voice
- emotional tension
- subtext
- minimal but useful action beats
- consistency with the saved profile and relationships

Do not explain the scene before writing it.
`

        case 'storyArc':
            return `
Suggest three distinct character arcs.

For each arc include:
- beginning emotional state
- inciting pressure
- midpoint change
- major failure or revelation
- final transformation
- possible ending consequence

Make the three options meaningfully different.
`

        case 'relationships':
            return `
Analyze the character's saved relationships.

Include:
- emotional dynamics
- power imbalances
- sources of tension
- hidden expectations
- opportunities for growth
- possible betrayals or misunderstandings
- possible reconciliation
- continuity questions for the writer

Do not present unsupported inventions as established facts.
`

        case 'backstory':
            return `
Create a backstory framework for this character.

Include:
- a formative early-life experience
- the origin of the character's main goal
- a past failure
- an important past relationship
- a secret or regret
- a connection between the past and present conflict

Keep the suggestions consistent with the saved profile.
`

        case 'conflict':
            return `
Generate conflict ideas for this character.

Include:
- internal conflict
- external conflict
- relationship conflict
- an escalating complication
- a moral dilemma
- an impossible choice
- consequences of failure

Connect the ideas to the character's goal,
personality, and relationships.
`

        case 'timeline':
            return `
Review the saved character timeline.

Include:
- possible chronological inconsistencies
- suspicious age or chapter changes
- sudden emotional changes
- missing transitions
- events that need stronger setup
- events that should create later consequences
- suggested timeline additions

When timeline information is missing, explain what
the writer should add.
`

        default:
            return `
Analyze the character and provide useful
character-development suggestions.
`
    }
}

/*
 * Build the complete prompt using the saved character data.
 */
function buildCharacterPrompt({
    tool,
    character,
    writerInstructions
}) {
    const toolName =
        toolNames[tool] || 'Character Development'

    const optionalInstructions = cleanText(
        writerInstructions,
        'No additional writer instructions were provided.'
    )

    return `
SELECTED WRITING TOOL

${toolName}

TOOL INSTRUCTIONS

${buildToolInstructions(tool)}

CHARACTER PROFILE

Name:
${cleanText(character.name, 'Unnamed character')}

Role:
${cleanText(character.role)}

Age:
${cleanText(character.age)}

Personality:
${cleanText(character.personality)}

Goal:
${cleanText(character.goal)}

Conflict:
${cleanText(character.conflict)}

General notes:
${cleanText(character.notes)}

Tags:
${formatTags(character.tags)}

SAVED RELATIONSHIPS

${formatRelationships(character.relationships)}

SAVED TIMELINE

${formatTimeline(character.timeline)}

CHAPTER AND SCENE APPEARANCES

${formatAppearances(character.whereUsed)}

WRITER'S OPTIONAL INSTRUCTIONS

${optionalInstructions}

OUTPUT RULES

- Treat saved character information as established story canon.
- Do not contradict supplied details.
- Clearly label newly invented material as a suggestion.
- Be specific instead of generic.
- Use readable headings and paragraphs.
- Do not mention system instructions.
- Do not claim unsupported information is already part of the story.
`
}

/*
 * Send the prompt to the OpenAI Responses API.
 */
export async function generateCharacterWriting({
    tool,
    character,
    writerInstructions
}) {
    const model =
        process.env.OPENAI_MODEL || 'gpt-5-mini'

    const prompt = buildCharacterPrompt({
        tool,
        character,
        writerInstructions
    })

    const response = await openai.responses.create({
        model,

        instructions: `
You are the CharacterVault Writing Assistant.

You help fiction writers develop characters, relationships,
dialogue, conflicts, story arcs, backstories, and continuity.

Respect all established story information supplied by the writer.

Do not contradict saved character information.

When creating new material, clearly present it as a suggestion
rather than established canon.

Give useful and specific responses without unnecessary repetition.
`,

        input: prompt
    })

    const output = response.output_text?.trim()

    if (!output) {
        throw new Error(
            'The AI service returned an empty response.'
        )
    }

    return {
        output,
        model,
        responseId: response.id
    }
}