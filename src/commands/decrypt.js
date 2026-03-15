import path from "node:path";
import fs from "node:fs/promises";
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export const decrypt = async ({ state, arg }) => {
    let opendFile;

    try {
        const { input, output, password } = arg ?? {};

        if (!input || !output || !password) {
            console.log("Invalid input");
            return;
        }

        const inputPath = path.resolve(state.currentDir, input);
        const outputPath = path.resolve(state.currentDir, output);

        opendFile = await fs.open(inputPath, 'r');
        const header = Buffer.alloc(28);
        await opendFile.read(header, 0, 28, 0);

        const salt = header.subarray(0, 16);
        const iv = header.subarray(16, 28);

        const stats = await opendFile.stat();
        const authTag = Buffer.alloc(16);
        await opendFile.read(authTag, 0, 16, stats.size - 16);

        const key = await scryptAsync(password, salt, 32);
        const decipher = createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);

        const rs = createReadStream(inputPath, { start: 28, end: stats.size - 17 });
        const ws = createWriteStream(outputPath);

        await pipeline(
            rs,
            decipher,
            ws
        );

       
    } catch(error) {
        console.log("Operation failed");
    } finally {
        if (opendFile) await opendFile.close();
    }
}