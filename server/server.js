import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { rateLimit } from 'express-rate-limit'
import aiRoutes from './routes/ai.js'

const app = express()

/*
 * Render and other hosting providers supply the server port
 * through an environment variable.
 */
const port =
    Number(process.env.PORT) || 3001

/*
 * CLIENT_URL can contain one frontend address or multiple
 * comma-separated addresses.
 *
 * Local example:
 * http://localhost:5173
 *
 * Production example:
 * http://localhost:5173,https://character-vault.vercel.app
 */
const allowedOrigins = (
    process.env.CLIENT_URL ||
    'http://localhost:5173'
)
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)

/*
 * Stop the backend when the OpenAI key is missing.
 *
 * This prevents the server from appearing healthy while every
 * AI request is guaranteed to fail.
 */
if (!process.env.OPENAI_API_KEY) {
    console.error(
        'OPENAI_API_KEY is missing from server/.env or the production environment.'
    )

    process.exit(1)
}

/*
 * Trust the first reverse proxy in production.
 *
 * Hosted services commonly place an application behind a
 * reverse proxy. This allows Express and the rate limiter to
 * identify the requesting IP more accurately.
 */
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
}

/*
 * Allow requests only from approved frontend addresses.
 *
 * Requests without a browser origin are also allowed so health
 * checks and development tools can reach the backend.
 */
app.use(
    cors({
        origin(origin, callback) {
            if (
                !origin ||
                allowedOrigins.includes(origin)
            ) {
                callback(null, true)
                return
            }

            callback(
                new Error(
                    `CORS blocked a request from ${origin}.`
                )
            )
        },

        methods: ['GET', 'POST'],

        allowedHeaders: [
            'Content-Type'
        ]
    })
)

/*
 * Parse incoming JSON request bodies.
 *
 * Character portraits are removed before AI requests, so one
 * megabyte provides enough room for detailed profiles,
 * relationships, appearances, and timelines.
 */
app.use(
    express.json({
        limit: '1mb'
    })
)

/*
 * Limit AI requests from one client.
 *
 * This protects the paid OpenAI API from accidental repeated
 * clicks and basic public abuse.
 *
 * Current limit:
 * 20 requests every 15 minutes per client.
 */
const aiRequestLimiter = rateLimit({
    windowMs:
        15 * 60 * 1000,

    limit: 20,

    standardHeaders: 'draft-8',

    legacyHeaders: false,

    message: {
        error:
            'Too many AI requests were submitted. Please wait before trying again.'
    }
})

/*
 * Health-check endpoint.
 *
 * Render can use this endpoint to determine whether the
 * CharacterVault backend started successfully.
 */
app.get(
    '/api/health',
    (request, response) => {
        response.status(200).json({
            status: 'ok',
            service: 'CharacterVault API',
            environment:
                process.env.NODE_ENV ||
                'development',
            timestamp:
                new Date().toISOString()
        })
    }
)

/*
 * Apply rate limiting only to the AI routes.
 */
app.use(
    '/api/ai',
    aiRequestLimiter,
    aiRoutes
)

/*
 * Handle unknown backend endpoints.
 */
app.use(
    (request, response) => {
        response.status(404).json({
            error: 'API route not found.'
        })
    }
)

/*
 * Handle unexpected backend and CORS errors.
 */
app.use(
    (
        error,
        request,
        response,
        next
    ) => {
        console.error(
            'Unexpected server error:',
            error
        )

        /*
         * Return a readable CORS error without exposing
         * private server details.
         */
        if (
            error.message?.startsWith(
                'CORS blocked'
            )
        ) {
            return response
                .status(403)
                .json({
                    error:
                        'This frontend is not allowed to access the CharacterVault API.'
                })
        }

        return response
            .status(500)
            .json({
                error:
                    'An unexpected backend error occurred.'
            })
    }
)

/*
 * Start the CharacterVault backend.
 */
app.listen(
    port,
    () => {
        console.log(
            `CharacterVault server running at http://localhost:${port}`
        )

        console.log(
            `Allowed frontend origins: ${allowedOrigins.join(', ')}`
        )
    }
)