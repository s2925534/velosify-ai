const axios = require('axios');

class OpenAIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
    }

    /**
     * Send a message to the OpenAI API.
     * @param {string} message - The message to send to OpenAI.
     * @param {number} tokensPerPage - Number of tokens estimated per page of content.
     * @param {number} totalTokens - Total tokens allowed (message + response).
     * @param {string} model - The model to use (default: gpt-3.5-turbo).
     * @returns {Promise<string>} - The content of the response.
     */
    async sendMessage(message, tokensPerPage, totalTokens, model = 'gpt-3.5-turbo') {
        try {
            // Calculate the remaining tokens for the response
            const availableTokens = totalTokens - Math.ceil(message.length / tokensPerPage);
            if (availableTokens <= 0) {
                throw new Error('Insufficient token allowance for the response.');
            }

            const response = await axios.post(
                this.baseURL,
                {
                    model,
                    messages: [{ role: 'user', content: message }],
                    max_tokens: availableTokens, // Set the remaining tokens for the response
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
}

module.exports = OpenAIClient;
