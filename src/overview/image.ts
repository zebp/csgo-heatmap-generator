import { join } from "path";
import { readFileSync, writeFileSync } from "fs";
import toRgbaBuffer from "./converter";
import { Point } from "../parser";
import Jimp from "jimp";
import { process } from "image-processor";

const parseDDS = require("parse-dds");
const toArrayBuffer = require("buffer-to-arraybuffer");

function parseImageToRGBA(csgoDirectory: string, map: string): Uint8Array {
    const fileBuffer = readFileSync(join(csgoDirectory, `csgo/resource/overviews/${map}_radar.dds`));
    const arrayBuffer = toArrayBuffer(fileBuffer);
    const dds = parseDDS(arrayBuffer);

    const image = dds.images[0];

    var pEncode = new Uint8Array(arrayBuffer, image.offset, image.shape[0] * image.shape[1] / 2);
    const pImageBuffer = new Uint8Array(image.shape[0] * image.shape[1] * 4);
    toRgbaBuffer(pImageBuffer, image.shape[0], image.shape[1], pEncode, ( 1 << 0 ));

    return pImageBuffer;
}

export default async function exportImage(csgoDirectory: string, map: string, points: Point[]): Promise<Jimp> {
    const buffer = parseImageToRGBA(csgoDirectory, map);
    const pixelBuffer = process(buffer, toPointBuffer(points), 1024);

    let image = new Jimp(1024, 1024);

    for (let i = 0; i < 1020 * 1024; i++) {
        const index = i * 4;

        image.bitmap.data[index + 0] = pixelBuffer[index + 0];
        image.bitmap.data[index + 1] = pixelBuffer[index + 1];
        image.bitmap.data[index + 2] = pixelBuffer[index + 2];
        image.bitmap.data[index + 3] = pixelBuffer[index + 3];
    }

    return image;
}

function toPointBuffer(points: Point[]): Uint16Array {
    let buffer = new Uint16Array(points.length * 2);

    for (let i = 0; i < points.length; i++) {
        const index = i * 2;
        const point = points[i];

        buffer[index + 0] = point.x;
        buffer[index + 1] = point.y;
    }

    return buffer;
}