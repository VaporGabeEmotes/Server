# VaporGabeEmotes Server

![Issues](https://img.shields.io/github/issues-raw/VaporGabeEmotes/server?style=for-the-badge)

## Server running and rendering the main VGE site and API.

This is the, you guessed it, VGE Server, node project.  It handles the main site, server side rendering, the API, handles interaction with a [FaunaDB](https://fauna.com/), and hosts the emote image files.

## How to install & tweak project

1. Clone the project
2. Install [Node JS & NPM](https://nodejs.org/)
3. Navigate to the ddirectory you cloned the project to.
4. Run `npm init`
    - *Note, the main passport-twitch strategy is outdated and not actively updated, I use [this patch](https://github.com/nums/passport-twitch/tree/patch-1), just replace the files in node_modules/passport-twitch/lib/passport-twitch with the same files in the patch repo.*
5. Create a .env file to hold private keys and ids with required fields:
    - TWITCH_CLIENT_ID
    - TWITCH_CLIENT_SECRET
    - FAUNA_SECRET
    - COOKIE_SECRET : this one can be whatever you want, just a passcode string for the session cookie.
6. SSL
    - If not using SSL, the homepage twitch iframe will be blocked, in server.js, comment out the key and cert options in the options object and make sure `var server = http.createServer` and not https.
    - If using SSL, create ssl directory and put your certificate.pem, and privatekey.pem files in.
7. If using [Nodemon](https://www.npmjs.com/package/nodemon), run `nodemon server`, if not, run `node server`

## Contributer Guidelines

TODO: Contributors welcome :), please reference issues in pushes if possible!

## Find a bug?

If you found a bug or want an improvement, please use the issues tab above.

## Known Issues

Still very early WIP

## Like this project?

If you use this project/service and are feeling generous, please leave a tip on my [Ko-fi](Ko-fi.com/vaporgabe)!