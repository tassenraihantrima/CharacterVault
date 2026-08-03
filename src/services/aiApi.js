/*
 * Sends a writing request to the CharacterVault Express backend.
 */
export async function generateAiWriting({
    tool,
    character,
    writerInstructions
}) {
    const apiBaseUrl =
        import.meta.env.VITE_API_URL ||
        'http://localhost:3001'

    /*
     * Removes large portrait images before sending the
     * character data to the backend.
     */
    function prepareCharacterForAi(character) {
        if (!character) return null

        const {
            portrait,
            ...characterWithoutPortrait
        } = character

        return characterWithoutPortrait
    }

    let response

    try {
        /*
         * Send the selected writing tool, character information,
         * and optional instructions to the Express API.
         */
        response = await fetch(
            `${apiBaseUrl}/api/ai/generate`,
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    tool,
                    character:
                        prepareCharacterForAi(
                            character
                        ),
                    writerInstructions
                })
            }
        )
    } catch {
        /*
         * The backend could not be reached.
         */
        throw new Error(
            'Could not connect to the CharacterVault backend. Make sure it is running on port 3001.'
        )
    }

    /*
     * Read the response as plain text first.
     * This allows us to display useful debugging
     * information if the server returns HTML or
     * another invalid response.
     */
    const rawResponse =
        await response.text()

    let data

    try {
        /*
         * Attempt to parse the server response as JSON.
         */
        data = JSON.parse(rawResponse)
    } catch {
        console.error(
            'Backend returned:',
            rawResponse
        )

        throw new Error(
            `The backend returned a non-JSON response (status ${response.status}). Check the backend terminal for details.`
        )
    }

    /*
     * Display the backend error when the request fails.
     */
    if (!response.ok) {
        throw new Error(
            data.error ||
            `The writing assistant request failed (status ${response.status}).`
        )
    }

    /*
     * Ensure the backend actually returned AI output.
     */
    if (!data.output) {
        throw new Error(
            'The backend returned an empty AI response.'
        )
    }

    return data
}