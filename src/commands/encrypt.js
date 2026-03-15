import path from "node:path";
import fs from "node:fs/promises";
import { createCipheriv, randomBytes, scrypt } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export const encrypt = async ({ state, arg }) => {
    try {
        const { input, output, password } = arg ?? {};

        if (!input || !output || !password) {
            console.log("Invalid input");
            return;
        }

        const inputPath = path.resolve(state.currentDir, input);
        const outputPath = path.resolve(state.currentDir, output);

        const salt = randomBytes(16);
        const iv = randomBytes(12);

        const key = await scryptAsync(password, salt, 32);

        const cipher = createCipheriv(
            'aes-256-gcm',
            key,
            iv
        )

        const header = Buffer.concat([salt, iv]);

        const rs = createReadStream(inputPath);
        const ws = createWriteStream(outputPath);

        ws.write(header);

        await pipeline(
            rs,
            cipher,
            ws
        );    
        
        const tag = cipher.getAuthTag();
        await fs.appendFile(outputPath, tag);

    } catch (error) {
        console.log("Operation failed");
    }
}