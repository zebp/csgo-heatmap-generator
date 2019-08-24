import { readdirSync } from "fs";
import { join } from "path";

export default function(demoDirectory: string): string[] {
    const files = readdirSync(demoDirectory);
    return files.map(file => join(demoDirectory, file));
}