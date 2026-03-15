import path from "node:path";
import fs from 'node:fs/promises';
import { csvToJson } from "./commands/csvToJson.js";
import { jsonToCsv } from "./commands/jsonToCsv.js";
import { count } from "./commands/count.js";
import { hash } from "./commands/hash.js";
import { hashCompare } from "./commands/hashCompare.js";
import { encrypt } from "./commands/encrypt.js";
import { decrypt } from "./commands/decrypt.js";

const up = ({ state }) => {
    const parent = path.dirname(state.currentDir);

    if (parent !== state.currentDir) {
        state.currentDir = parent;
    }
}

const cd = async ({ state, commandValue }) => {
    if (!commandValue) {
        console.log("Invalid input")
        return;
    }

    const resolvedPath = path.resolve(state.currentDir, commandValue);
    
    try {
        const stat = await fs.stat(resolvedPath);

        if (stat.isDirectory()) {
            state.currentDir = resolvedPath;
        } else {
            console.log("Operation failed");
        }
    } catch (error) {
        console.log("Operation failed")
    }
}

const ls = async ({ state }) => {
    try {
        const dirFiles = await fs.readdir(state.currentDir, { withFileTypes: true });

        const folders = [];
        const files = [];

        for (let file of dirFiles) {
            if (file.isDirectory()) {
                folders.push(`${file.name} [folder]`)
            } else {
                files.push(`${file.name} [file]`)
            }
        }

        const foldersSort = folders.sort();
        const filesSort = files.sort();
        const result = foldersSort.concat(filesSort);

        result.forEach((item) => {
            console.log(item)
        })
    } catch (error) {
        console.log("Operation failed");
    }
}

export const COMMANDS = {
  up,
  cd,
  ls,
  ['csv-to-json']: csvToJson,
  ['json-to-csv']: jsonToCsv,
  count,
  hash,
  ['hash-compare']: hashCompare,
  encrypt,
  decrypt
}
