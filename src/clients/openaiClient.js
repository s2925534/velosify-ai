const axios = require('axios');

class OpenAIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
    }

    async sendMessage(message, model = 'gpt-3.5-turbo') {
        try {
            const response = await axios.post(
                this.baseURL,
                { model, messages: [{ role: 'user', content: message }] },
                { headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    }
                }
            );
            return response.data.choices[0].message.content;
        } catch (error) {
            throw new Error(`Failed to get response from ChatGPT: ${error.message}`);
        }
    }
}

module.exports = OpenAIClient;
