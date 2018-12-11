"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const Bot_1 = __importDefault(require("./lib/Bot"));
const bot = new Bot_1.default(path_1.default.join(__dirname, '../config/client.json'));
bot.initialize()
    .then(() => {
    console.log('Bot ready!');
})
    .catch((err) => {
    console.log(`There was a problem initializing bot: ${err.message}`);
});
