import express from 'express'
import {
    generateCharacterWriting
} from '../services/aiService.js'

const router = express.Router()

/*
 * Writing tools accepted by the CharacterVault backend.
 */
const supportedTools = new Set([
    'summary',
    'personality',
    'improvements',
    'dialogue',
    'storyArc',
    'relationships',
    'backstory',
    'conflict',
    'timeline'
])

/*
 * POST /api/ai/generate
 *
 * Receives the selected tool, character data,
 * and optional writer instructions.
 */
router.post('/generate', async (request, response) => {
    try {
        const {
            tool,
            character,
            writerInstructions = ''
        } = request.body

        // Reject unsupported writing tools.
        if (!supportedTools.has(tool)) {
            return response.status(400).json({
                error: 'Please select a supported writing tool.'
            })
        }

        // Reject missing or invalid character data.
        if (
            !character ||
            typeof character !== 'object' ||
            Array.isArray(character)
        ) {
            return response.status(400).json({
                error: 'A valid character profile is required.'
            })
        }

        // Writer instructions must be text.
        if (typeof writerInstructions !== 'string') {
            return response.status(400).json({
                error: 'Writer instructions must be text.'
            })
        }

        // Limit the instruction size.
        if (writerInstructions.length > 2000) {
            return response.status(400).json({
                error:
                    'Writer instructions must contain 2,000 characters or fewer.'
            })
        }

        // Send the validated request to the OpenAI service.
        const result = await generateCharacterWriting({
            tool,
            character,
            writerInstructions
        })

        return response.status(200).json({
            output: result.output,
            model: result.model,
            responseId: result.responseId
        })
    } catch (error) {
        console.error('AI generation failed:', error)

        // Invalid or missing API key.
        if (
            error.status === 401 ||
            error.code === 'invalid_api_key'
        ) {
            return response.status(500).json({
                error:
                    'The AI service could not authenticate. Check the API key in server/.env.'
            })
        }

        // Billing, quota, or rate-limit problem.
        if (error.status === 429) {
            return response.status(429).json({
                error:
                    'The AI request limit was reached. Check API billing or try again later.'
            })
        }

        // Invalid model or malformed API request.
        if (error.status === 400) {
            return response.status(500).json({
                error:
                    'The AI request was rejected. Check the model configured in server/.env.'
            })
        }

        return response.status(500).json({
            error:
                'The writing assistant could not generate a response.'
        })
    }
})

export default router