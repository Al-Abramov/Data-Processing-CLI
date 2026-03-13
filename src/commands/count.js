import path from "node:path";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";

export const createCountTransform = () => {
    let lines = 0;
    let words = 0;
    let characters = 0;
    let leftover = "";

    return new Transform({
        transform(chunk, encoding, callback) {
            const text = leftover + chunk.toString();

            characters += chunk.length;

            const splittedText = text.split("\n");
            leftover = splittedText.pop();
            lines += splittedText.length;
            
            for (const line of splittedText) {
                const wordsOfLine = line.split(' ').filter(Boolean);
                words += wordsOfLine.length;
            }

            callback();
        },

        flush(callback) {
            if (!leftover) return;

            lines += 1;
            const wordsOfLine = leftover.split(' ').filter(Boolean);
            words += wordsOfLine.length;

            console.log(`Lines: ${lines}`);
            console.log(`Words: ${words}`);
            console.log(`Characters: ${characters}`);

            callback();
        }
    })
}

export const count = async ({ state, arg }) => {
    try {
        const { input } = arg ?? {};

        if (!input) {
            console.log("Invalid input");
            return;
        }

        const filePath = path.resolve(state.currentDir, input);

        const rs = createReadStream(filePath);

        await pipeline(
            rs,
            createCountTransform()
        )

    } catch (error) {
        console.log("Operation failed");
        throw error
    }
}