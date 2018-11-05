# somereason irc bot

Just another IRC bot. All the cool kids are doing it! 👈👈😎

## Getting Started

### Prerequisites

- Node.js (I like using `nvm` personally. See more: [Node Version Manager](https://github.com/creationix/nvm))
- If you want to use the Giphy plugin, you must [register for API key](https://developers.giphy.com/docs/#api-keys)
- If you want to use the Youtube plugin, you must [register for API key](https://developers.google.com/youtube/registering_an_application)

### Steps

- `git clone git@github.com:mikerogne/somereason.git`
- `npm install`
- `cp config/example-client.json config/client.json` (this is where you set the config options)
- `npm start` (If you want giphy support, you must specify your API key: `GIPHY_API_KEY=key npm start`)

## Running the tests

- `npm run test` _or_ `npm run watch`

JetBrains users might want to check out: [Get rid of "Unresolved function/method/variable" warning in Jest test files](https://intellij-support.jetbrains.com/hc/en-us/community/posts/115000357324-Get-rid-of-Unresolved-function-method-variable-warning-in-Jest-test-files?page=1#community_comment_115000322910)

## Contributing

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC)

## Acknowledgments

- https://github.com/Throne3d/node-irc/
- https://github.com/austinkelleher/giphy-api
