module.exports = {
    transform: {
        '^.+\\.js$': 'babel-jest', // Transform JavaScript files using Babel
    },
    transformIgnorePatterns: [
        '/node_modules/(?!axios)', // Transform ESM dependencies in node_modules
    ],
};
