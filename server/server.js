import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import aiRoutes from './routes/ai.js'

const app = express()

const port = Number(process.env.PORT) || 3001

const clientUrl =
    process.env.CLIENT_URL || 'http://localhost:5173'

/*
 * Stop the backend if the OpenAI API key is missing.
 */
if (!process.env.OPENAI_API_KEY) {
    console.error(
        'OPENAI_API_KEY is missing from server/.env'
    )

    process.exit(1)
}

/*
 * Allow requests from the React frontend.
 */
app.use(
    cors({
        origin: clientUrl,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    })
)

/*
 * Allow Express to read incoming JSON data.
 */
app.use(
    express.json({
        limit: '1mb'
    })
)

/*
 * Health-check endpoint.
 */
app.get('/api/health', (request, response) => {
    response.status(200).json({
        status: 'ok',
        service: 'CharacterVault API'
    })
})

/*
 * AI routes.
 *
 * Complete endpoint:
 * POST /api/ai/generate
 */
app.use('/api/ai', aiRoutes)

/*
 * Handle unknown API routes.
 */
app.use((request, response) => {
    response.status(404).json({
        error: 'API route not found.'
    })
})

/*
 * Handle unexpected server errors.
 */
app.use((error, request, response, next) => {
    console.error(
        'Unexpected server error:',
        error
    )

    response.status(500).json({
        error: 'An unexpected backend error occurred.'
    })
})

/*
 * Start the backend.
 */
app.listen(port, () => {
    console.log(
        `CharacterVault server running at http://localhost:${port}`
    )
})