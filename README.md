# somereason irc bot

Just another IRC bot. All the cool kids are doing it! 👈👈😎

## Getting Started

### Prerequisites

- Node.js (I like using `nvm` personally. See more: [Node Version Manager](https://github.com/creationix/nvm))
- Common sense

### Plugins Requiring API Key

- **GIPHY**: [Register for API key](https://developers.giphy.com/docs/#api-keys)
- **TENOR**: [Register for API key](https://tenor.com/gifapi/documentation)
- **YOUTUBE**: [Register for API key](https://developers.google.com/youtube/registering_an_application)
- **DOCS**: App ID & API key required -- but you have to find this on your own :).

### Getting Up & Running

- `git clone git@github.com:mikerogne/somereason.git`
- `npm ci`
- `cp config/example-client.json config/client.json` (this is where you set the config options)
- `cp config/example-env.json config/env.json` (this is where you set the env options)
- `cp config/example-ignored_users.json config/ignored_users.json` (this is where you set the ignored users - but use .ignore/.unignore for that)
- `npm start` (Make sure to set the appropriate values in config/env.json - depending on which plugins you want to use!)

## Running the tests

- `npm run test` _or_ `npm run watch`

JetBrains users might want to check out: [Get rid of "Unresolved function/method/variable" warning in Jest test files](https://intellij-support.jetbrains.com/hc/en-us/community/posts/115000357324-Get-rid-of-Unresolved-function-method-variable-warning-in-Jest-test-files?page=1#community_comment_115000322910)

## Contributing

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC)

## Acknowledgments

- https://github.com/Throne3d/node-irc/
- Shoutout to [asteele](https://github.com/cronoh) for the TypeScript help!
