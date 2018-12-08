"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
module.exports = () => {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(path_1.default.join(__dirname, '../../config/env.json'), 'utf8', (err, content) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(content);
            }
        });
    });
};
