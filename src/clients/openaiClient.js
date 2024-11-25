const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');
const { parse } = require('csv-parse/sync');
const mammoth = require('mammoth'); // For DOCX
const pdfParse = require('pdf-parse'); // For PDFs
const tesseract = require('tesseract.js'); // For OCR

class OpenAIClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        // Define models and their maximum token limits
        this.models = {
            'gpt-3.5-turbo': 4096,
            'gpt-4': 8192,
            'gpt-4-32k': 32768,
            'gpt-4-turbo': 128000, // Example model with a larger context window
            // Add more models as needed
        };
    }

    /**
     * Send a message to the OpenAI API.
     * @param {string} message - The message to send to OpenAI.
     * @param {Object} options - Options for the API call.
     * @param {string|null} filePath - Optional path to a file to include in the request.
     * @returns {Promise<string>} - The content of the response.
     */
    async sendMessage(message, options = {}, filePath = null) {
        try {
            let additionalContent = '';
            if (filePath) {
                const fileContent = await this.processFile(filePath);
                additionalContent = `\n\nPlease consider the following additional content from the file "${path.basename(filePath)}":\n${fileContent}`;
            }

            const fullMessage = message + additionalContent;

            // Calculate the approximate token count of the full message
            const inputTokenCount = await this.approximateTokenCount(fullMessage);
            const desiredOutputTokens = options.max_tokens || 1000; // Default to 1000 if not specified
            const totalTokenCount = inputTokenCount + desiredOutputTokens;

            // Select an appropriate model based on the total token count
            const selectedModel = this.selectModel(totalTokenCount);
            if (!selectedModel) {
                throw new Error('Input exceeds the maximum token limit of all available models.');
            }

            // Set default values for optional parameters
            const {
                temperature = 0.7,
                top_p = 1,
                n = 1,
                stream = false,
                stop = null,
                presence_penalty = 0,
                frequency_penalty = 0,
                logit_bias = null,
                user = null,
            } = options;

            // Make the API request
            const response = await axios.post(
                this.baseURL,
                {
                    model: selectedModel,
                    messages: [{ role: 'user', content: fullMessage }],
                    max_tokens: desiredOutputTokens,
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
            if (error.response) {
                console.error('Error response:', error.response.data);
                throw new Error(`Failed to get response from ChatGPT: ${error.response.data.error.message}`);
            } else {
                throw new Error(`Failed to get response from ChatGPT: ${error.message}`);
            }
        }
    }

    /**
     * Select an appropriate model based on the total token count.
     * @param {number} totalTokenCount - The total number of tokens (input + desired output).
     * @returns {string|null} - The selected model name or null if none can accommodate the token count.
     */
    selectModel(totalTokenCount) {
        // Sort models by their token limits in ascending order
        const sortedModels = Object.entries(this.models).sort((a, b) => a[1] - b[1]);

        // Find the first model that can accommodate the total token count
        for (const [model, maxTokens] of sortedModels) {
            if (totalTokenCount <= maxTokens) {
                return model;
            }
        }

        // If no model can accommodate the token count, return null
        return null;
    }

    /**
     * Process a file and return its textual content.
     * @param {string} filePath - Path to the file.
     * @returns {Promise<string>} - The content extracted from the file.
     */
    async processFile(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const buffer = await fs.readFile(filePath);

        if (['.txt', '.csv'].includes(ext)) {
            return buffer.toString(); // Read plain text or CSV as text
        } else if (ext === '.csv') {
            const records = parse(buffer.toString(), { columns: true });
            return JSON.stringify(records, null, 2); // Convert CSV to JSON-like string
        } else if (ext === '.docx') {
            const result = await mammoth.extractRawText({ buffer });
            return result.value; // Extract text from DOCX
        } else if (ext === '.pdf') {
            const result = await pdfParse(buffer);
            return result.text; // Extract text from PDF
        } else if (['.png', '.jpg', '.jpeg', '.bmp'].includes(ext)) {
            const result = await tesseract.recognize(buffer, 'eng');
            return result.data.text; // Extract text via OCR
        } else {
            throw new Error(`Unsupported file type: ${ext}`);
        }
    }

    /**
     * Approximates the token count of a message.
     * @param {string} text - The message to approximate token count for.
     * @returns {Promise<number>} - The approximated token count.
     */
    async approximateTokenCount(text) {
        const tokens = text.match(/\S+/g); // Split on non-whitespace sequences
        return tokens ? tokens.length : 0;
    }
}

module.exports = OpenAIClient;
