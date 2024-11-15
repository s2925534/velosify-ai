const OpenAIClient = require('./clients/openaiClient');

class AIClient {
    constructor(apiKey, provider = 'openai') {
        if (!apiKey) {
            throw new Error('API key is required to initialize AIClient.');
        }

        switch (provider) {
            case 'openai':
                this.client = new OpenAIClient(apiKey);
                break;
            default:
                throw new Error(`Provider ${provider} not supported.`);
        }
    }

    async sendMessage(message, model = 'gpt-3.5-turbo') {
        return this.client.sendMessage(message, model);
    }
}

module.exports = AIClient;
