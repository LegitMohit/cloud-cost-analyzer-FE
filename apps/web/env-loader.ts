import path from "path";
import fs from "fs";
import dotenv from "dotenv";

const currentDir = process.cwd();
const pathsToTry = [
    path.join(currentDir, ".env"),
    path.join(currentDir, "..", "..", ".env"),
];

for (const envPath of pathsToTry) {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        break;
    }
}
