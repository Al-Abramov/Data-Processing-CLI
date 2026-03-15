import os from "node:os";
import { printCurrentDir } from "./helpers/index.js";
import { startRepl } from "./repl.js";

const state = {
    currentDir: os.homedir()
}

console.log('Welcome to Data Processing CLI!')
printCurrentDir(state.currentDir);

startRepl(state);
