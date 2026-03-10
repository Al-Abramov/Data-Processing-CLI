import { createInterface} from "node:readline/promises"
import { printCurrentDir } from "./helpers/index.js";

export const startRepl = (state) => {
    const { currentDir } = state;

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '> '
    });

    rl.prompt()

    rl.on("line", (line) => {
        const command = line.trim();

        if (command === ".exit") {
            rl.close();
            return;
        }

        printCurrentDir(currentDir );

        rl.prompt()
    })

    rl.on("SIGINT", () => {
        rl.close()
    })

    rl.on('close', () => {
        console.log('Thank you for using Data Processing CLI!');
    });
}
