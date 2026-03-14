import path from "node:path";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const ALGORITHMS = ["sha256", "md5", "sha512"];

export const hash = async ({ state, arg }) => {
    try {
        const { input, algorithm = "sha256", save } = arg ?? {};

        if (!input) {
            console.log("Invalid input");
            return;
        }

        if (!ALGORITHMS.includes(algorithm)) {
            console.log("Operation failed");
            return;
        }
        
        const filePath = path.resolve(state.currentDir, input);

        const hash = createHash(algorithm);
        const rs = createReadStream(filePath);

        await pipeline(rs, hash);

        const fileHash = hash.digest("hex");

        console.log(`${algorithm}: ${fileHash}`);

        if (save) {
            const newFileName = `${filePath}.${algorithm}`;
            await writeFile(newFileName, fileHash);
        }
    } catch (error) {
        console.log("Operation failed");
    }
}