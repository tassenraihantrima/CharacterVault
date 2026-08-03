/*
  Vite reads frontend environment variables that begin
  with VITE_.

  During local development, the API defaults to port 3001.
*/
const apiBaseUrl =
    import.meta.env.VITE_API_URL ||
    'http://localhost:3001'

/*
  Remove portrait data before sending the character profile.

  Portraits are Base64 strings and are unnecessary for
  text generation.
*/
function prepareCharacterForAi(character) {
    if (!character) return null

    const {
        portrait,
        ...characterWithoutPortrait
    } = character

    return characterWithoutPortrait
}

/*
  Request real AI-generated writing from the backend.
*/
export async function generateAiWriting({
    tool,
    character,
    writerInstructions
}) {
    const response = await fetch(
        `${apiBaseUrl}/api/ai/generate`,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                tool,
                character: prepareCharacterForAi(character),
                writerInstructions
            })
        }
    )

    /*
      Read the response body even for unsuccessful requests
      so the frontend can display the backend's error message.
    */
    const data = await response.json().catch(() => ({
        error:
            'The server returned an unreadable response.'
    }))

    if (!response.ok) {
        throw new Error(
            data.error ||
            'The writing assistant request failed.'
        )
    }

    if (!data.output) {
        throw new Error(
            'The server returned an empty writing response.'
        )
    }

    return data
}