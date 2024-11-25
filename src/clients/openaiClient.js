const axios = require('axios');

class OpenAIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
    }

    /**
     * Send a message to the OpenAI API.
     * @param {string} message - The message to send to OpenAI.
     * @param {string} model - The model to use (default: gpt-3.5-turbo).
     * @returns {Promise<string>} - The content of the response.
     */
    async sendMessage(message, model = 'gpt-3.5-turbo') {
        try {
            // Calculate the max tokens for processing
            const tokenCount = await this.approximateTokenCount(message);

            const response = await axios.post(
                this.baseURL,
                {
                    model,
                    messages: [{role: 'user', content: message}],
                    max_tokens: tokenCount,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                }
            );
            return response.data.choices[0].message.content;
        } catch (error) {
            throw new Error(`Failed to get response from ChatGPT: ${error.message}`);
        }
    }

    async approximateTokenCount(text) {
        // Split the text by spaces, punctuation, and special characters
        const tokens = text.match(/\S+/g); // Split on non-whitespace sequences
        return tokens ? tokens.length : 0; // Return the count of tokens
    }
}

module.exports = OpenAIClient;
