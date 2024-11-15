# Velosify AI

`velosify-ai` is a Node.js library designed to seamlessly integrate AI services like OpenAI’s ChatGPT into your Node.js projects. This library enables developers to easily interact with AI APIs and get powerful results with minimal setup.

## Author
- **Pedro Veloso** ([pedro@veloso.dev](mailto:pedro@veloso.dev))

## Repository
- **GitHub Repository**: [https://github.com/s2925534/velosify-ai](https://github.com/s2925534/velosify-ai)

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
  - [Example with ChatGPT (OpenAI)](#example-with-chatgpt-openai)
  - [Detailed Explanation](#detailed-explanation)
3. [API Methods](#api-methods)
4. [Future Implementations](#future-implementations)
5. [Running Tests](#running-tests)
6. [Contributing](#contributing)
7. [License](#license)
8. [Contact](#contact)

## Installation

To install the `velosify-ai` library, use the following command:

```bash
npm install velosify-ai
```

Make sure you have Node.js and npm installed before proceeding.

## Usage

Once installed, you can use `velosify-ai` to interact with various AI services. The first version of this library supports **OpenAI’s ChatGPT**, and more AI platforms will be integrated in future updates.

### Example with ChatGPT (OpenAI)

1. **Install dependencies** (if not already installed):

```bash
npm install velosify-ai axios dotenv
```

2. **Create a `.env` file** in your project root:

```dotenv
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Create a simple JavaScript file** (e.g., `index.js`) to use the library:

```javascript
const AIClient = require('velosify-ai');

// Initialize the AIClient with your OpenAI API key
const client = new AIClient(process.env.OPENAI_API_KEY);

async function getChatGPTResponse() {
  try {
    const response = await client.sendMessage('What is the capital of France?');
    console.log('ChatGPT says:', response);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getChatGPTResponse();
```

### Detailed Explanation

- **`AIClient` Constructor**:
  - Takes your API key (from OpenAI) as the first parameter.
  - The second parameter is optional and specifies the AI service provider (defaults to `'openai'`).

- **`sendMessage` method**:
  - Sends a message to the specified AI model (defaults to `'gpt-3.5-turbo'`).
  - Returns the AI’s response.

## API Methods

### `new AIClient(apiKey, provider = 'openai')`

- **Description**: Initializes the AIClient with the provided API key and the AI provider (currently only supports `'openai'`).
- **Parameters**:
  - `apiKey` (string): Your API key for the AI service (required).
  - `provider` (string, optional): The AI provider to use. Defaults to `'openai'`.

### `sendMessage(message, model = 'gpt-3.5-turbo')`

- **Description**: Sends a message to the specified AI model and returns the response.
- **Parameters**:
  - `message` (string): The text message to send to the AI model.
  - `model` (string, optional): The AI model to use (e.g., `'gpt-3.5-turbo'`). Defaults to `'gpt-3.5-turbo'`.
- **Returns**: The AI’s response as a string.

## Future Implementations

In upcoming versions, support for additional AI platforms will be added. Future AI integrations include:

- Google Cloud AI (Vertex AI)
- Microsoft Azure Cognitive Services
- Hugging Face API
- Cohere
- Anthropic’s Claude
- Stability AI
- IBM Watson
- AssemblyAI
- DeepL

## Running Tests

The library includes tests that ensure everything works as expected. To run the tests, follow these steps:

1. **Install dependencies**:

```bash
npm install
```

2. **Run the tests** using Jest:

```bash
npm test
```

This will execute the test suite located in the `test/` directory, ensuring the library’s functionality is intact.

## Contributing

We welcome contributions to the `velosify-ai` library! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes.
4. Run the tests to ensure everything works.
5. Submit a pull request with a description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

## Contact

For questions, feature requests, or other inquiries, feel free to contact me:

- **Pedro Veloso** ([pedro@veloso.dev](mailto:pedro@veloso.dev))
