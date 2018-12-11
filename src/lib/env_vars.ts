import fs from 'fs';
import path from 'path';

export = () => {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../../config/env.json'), 'utf8', (err: any, content: string) => {
            if (err) {
                reject(err);
            } else {
                resolve(content);
            }
        });
    });
};
