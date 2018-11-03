/**
 * Ok, so this is a little annoying, but I don't know a workaround yet.
 *
 * Basically, require('giphy-api') returns a function that, when invoked, returns an instance of
 * the real object we'll use to use giphy.
 *
 * Mocking that proved very painful, so this is a solution for that.
 */

module.exports = require('giphy-api')(process.env.GIPHY_API_KEY);
