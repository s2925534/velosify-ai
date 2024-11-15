const AIClient = require('../src/index');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;
const client = new AIClient(apiKey);

describe('AIClient', () => {
    it('should return a response from ChatGPT', async () => {
        const response = await client.sendMessage('Hello, how are you?');
        console.log("Response:", response)
        expect(typeof response).toBe('string');
        expect(response.length).toBeGreaterThan(0);
    });
});
