module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "plugins": [
        "vue"
    ],
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 8,
    },
    "rules": {
        "quotes": [
            "error",
            "single"
        ]
    },
    "ecmaFeatures": {
        "jsx": true,
        "experimentalObjectRestSpread": true
    }
};