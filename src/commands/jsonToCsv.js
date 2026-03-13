import path from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";

const jsonToCsvTransform = () => {
    let buffer = '';

    return new Transform({
        transform(chunk, encoding, callback) {
            buffer += chunk.toString();
            callback();
        },

        flush(callback) {
            try {
                const data = JSON.parse(buffer);

                if (!Array.isArray(data)) {
                    throw new Error("Invalid JSON");
                }

                const headers = Object.keys(data[0]).join(",") + "\n";
                this.push(headers);

                for (const row of data) {
                    const line = Object.values(row).join(",") + "\n";
                    this.push(line);
                }

                callback();
            } catch (err) {
                callback(err);
            }
        }
    });
};

export const jsonToCsv = async ({ state, arg }) => {
    try {
        const { input, output } = arg ?? {};

        if (!input || !output) {
            console.log("Invalid input");
            return;
        }

        const jsonPath = path.resolve(state.currentDir, input);
        const csvPath = path.resolve(state.currentDir, output);
        
        const rs = createReadStream(jsonPath, { encoding: "utf-8" });
        const ws = createWriteStream(csvPath);

        await pipeline(
            rs,
            jsonToCsvTransform(),
            ws
        );
    } catch (error) {
        console.log("Operation failed");
    }
}