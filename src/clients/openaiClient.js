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
     * @param options
     * @returns {Promise<string>} - The content of the response.
     */
    async sendMessage(message, model = 'gpt-3.5-turbo', options = {}) {
        try {
            // Calculate the max tokens for processing if not explicitly set
            const tokenCount = options.max_tokens || await this.approximateTokenCount(message);

            // Set default values for optional parameters
            const {
                temperature = 0.7,       // Default sampling temperature
                top_p = 1,               // Default nucleus sampling
                n = 1,                   // Default number of completions
                stream = false,          // Default streaming disabled
                stop = null,             // Default no stop sequences
                presence_penalty = 0,    // Default no presence penalty
                frequency_penalty = 0,   // Default no frequency penalty
                logit_bias = null,       // Default no token bias
                user = null,             // Default no user ID
            } = options;

            // Make the API request
            const response = await axios.post(
                this.baseURL,
                {
                    model,
                    messages: [{ role: 'user', content: message }],
                    max_tokens: tokenCount,
                    temperature,
                    top_p,
                    n,
                    stream,
                    stop,
                    presence_penalty,
                    frequency_penalty,
                    logit_bias,
                    user,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                }
            );

            // Return the response content
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
