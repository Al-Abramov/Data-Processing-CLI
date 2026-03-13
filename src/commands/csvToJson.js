import path from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";

export const csvParser = () => {
    let buffer = '';
    let header = null;
    let firstRow = true;

    return new Transform({
        transform(chunk, encoding, callback) {
            buffer += chunk.toString();
            const lines = buffer.split("\n");
            buffer = lines.pop();

            for (const line of lines) {
                const cleanLine = line.replace('\r', '').trim();
                if (!cleanLine) continue;

                if (!header) {
                    header = cleanLine.split(",");
                    this.push("[\n");
                    continue;
                }

                const values = cleanLine.split(",");
                const obj = {};
                header.forEach((name, i) => obj[name] = values[i] ?? null);

                const prefix = firstRow ? "" : ",\n";
                this.push(prefix + JSON.stringify(obj, null, 2));
                firstRow = false;
            }

            callback();
        },

        flush(callback) {
            if (buffer) {
                const cleanLine = buffer.replace('\r', '').trim();
                if (cleanLine) {
                    const values = cleanLine.split(",");
                    const obj = {};
                    header.forEach((name, i) => obj[name] = values[i] ?? null);

                    const prefix = firstRow ? "" : ",\n";
                    this.push(prefix + JSON.stringify(obj, null, 2));
                }
            }

            this.push("\n]");
            callback();
        }
    });
}

export const csvToJson = async ({ state, arg }) => {
    try {
        const { input, output } = arg ?? {};

        if (!input || !output) {
            console.log("Invalid input");
            return;
        }

        const csvPath = path.resolve(state.currentDir, input);
        const jsonPath = path.resolve(state.currentDir, output);

        const rs = createReadStream(csvPath);
        const ws = createWriteStream(jsonPath);

        await pipeline(
            rs,
            csvParser(),
            ws
        )
    } catch (error) {
        console.log("Operation failed");
    }
}