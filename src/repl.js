import { createInterface} from "node:readline/promises"
import { printCurrentDir } from "./helpers/index.js";
import { argParser } from "./utils/argParser.js";

export const startRepl = (state) => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> '
    });

    rl.prompt()

    rl.on("line", (line) => {
        const [command, ...args] = line.trim().split(" ");

        const { value, arg } = argParser(args);
        console.log(value, arg)
        if (!command) {
            rl.prompt()
            return;
        }

        if (command === ".exit") {
            rl.close();
            return;
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
