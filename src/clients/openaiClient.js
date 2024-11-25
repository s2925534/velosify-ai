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
    }

    /**
     * Send a message to the OpenAI API.
     * @param {string} message - The message to send to OpenAI.
     * @param {string} model - The model to use (default: gpt-3.5-turbo).
     * @param {Object} options - Options for the API call.
     * @param {string|null} filePath - Optional path to a file to include in the request.
     * @returns {Promise<string>} - The content of the response.
     */
    async sendMessage(message, model = 'gpt-3.5-turbo', options = {}, filePath = null) {
        try {
            let additionalContent = '';
            if (filePath) {
                const fileContent = await this.processFile(filePath);
                additionalContent = `\n\nPlease consider the following additional content from the file "${path.basename(filePath)}":\n${fileContent}`;
            }

            const fullMessage = message + additionalContent;

            // Calculate the max tokens for processing if not explicitly set
            const tokenCount = options.max_tokens || await this.approximateTokenCount(fullMessage);

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
                    model,
                    messages: [{ role: 'user', content: fullMessage }],
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
