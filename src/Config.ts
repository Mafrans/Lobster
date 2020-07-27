import {AbstractConfig} from "./AbstractConfig";

const fs = require('fs');

class Config {
    private json: any;

    load(path: string): Promise<AbstractConfig> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if(err != null) reject(err);
                else {
                    this.json = JSON.parse(data);
                    resolve(this.json);
                }
            });
        });
    }

    save(path: string): Promise<AbstractConfig> {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, JSON.stringify(this.json, null, 1), 'utf8', (err) => {
                if(err != null) reject(err);
                else resolve(this.json);
            });
        });
    }

    saveDefault(path: string): Promise<AbstractConfig> {
        this.json = new AbstractConfig();
        return this.save(path);
    }
}

export default new Config();