import { createInterface} from "node:readline/promises"
import { printCurrentDir } from "./helpers/index.js";
import { argParser } from "./utils/argParser.js";
import { COMMANDS } from "./navigation.js";

export const startRepl = (state) => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> '
    });

    rl.prompt()

    rl.on("line", async (line) => {
        const [command, ...args] = line.trim().split(" ");

        const { commandValue, arg } = argParser(args);

        if (!command) {
            rl.prompt()
            return;
        }

        if (command === ".exit") {
            rl.close();
            return;
        }

        const navHandler = COMMANDS[command];

        if (navHandler) {
            await navHandler({ state, commandValue, arg });
        } else {
            console.log("Invalid input")
        }

        printCurrentDir(state.currentDir );

        rl.prompt()
    })

    rl.on("SIGINT", () => {
        rl.close()
    })

    rl.on('close', () => {
        console.log('Thank you for using Data Processing CLI!');
    });
}
