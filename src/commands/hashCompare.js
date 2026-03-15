import path from "node:path";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { ALGORITHMS } from "../constants.js";

export const hashCompare = async ({ state, arg }) => {
    try {
        const { input, hash: fileWithHash, algorithm = "sha256" } = arg ?? {};

        if (!input || !fileWithHash) {
            console.log("Invalid input");
            return;
        }

        if (!ALGORITHMS.includes(algorithm)) {
            console.log("Operation failed");
            return;
        }

        const inputFilePath = path.resolve(state.currentDir, input);
        const hashFilePath = path.resolve(state.currentDir, fileWithHash);

        const hash = createHash(algorithm)
        const rs = createReadStream(inputFilePath);

        await pipeline(rs, hash);

        const inputFileHash = hash.digest("hex").toLowerCase();

        const fileHashText = (await readFile(hashFilePath, "utf-8")).trim().toLowerCase();

        if (inputFileHash === fileHashText) {
            console.log("OK");
        } else {
            console.log("MISMATCH");
        }
    } catch (error) {
        console.log("Operation failed");
    }
}