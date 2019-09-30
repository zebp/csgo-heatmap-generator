import { readFileSync } from "fs";
import { join } from "path";

export type OverlayInformation = {
    material: string,
    pos_x: number,
    pos_y: number,
    scale: number
}

export default async function parseOverlayInformation(csgoDirectory: string, map: string): Promise<OverlayInformation> {
    let information = {
        material: `${map}_radar`,
        pos_x: NaN,
        pos_y: NaN,
        scale: NaN
    };

    const file = readFileSync(join(csgoDirectory, `csgo/resource/overviews/${map}.txt`), "UTF8");

    file.replace(/\r/g, "").split("\n").forEach(line => {
        const segments = line.split(/\t/).filter(segment => segment.length > 0).map(segment => segment.replace(/"/g, ""));

        if (segments.length >= 2) {
            (information as any)[segments[0]] = segments[1];
        }
    });

    return information;
}