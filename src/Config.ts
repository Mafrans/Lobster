import {AbstractConfig} from "./AbstractConfig";

const fs = require('fs');

class Config {
    data: AbstractConfig;

    load(path: string): Promise<AbstractConfig> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if(err != null) reject(err);
                else {
                    this.data = JSON.parse(data);
                    resolve(this.data);
                }
            });
        });
    }

    save(path: string): Promise<AbstractConfig> {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, JSON.stringify(this.data, null, 1), 'utf8', (err) => {
                if(err != null) reject(err);
                else resolve(this.data);
            });
        });
    }

    saveDefault(path: string): Promise<AbstractConfig> {
        this.data = new AbstractConfig();
        return this.save(path);
    }
}

export default new Config();