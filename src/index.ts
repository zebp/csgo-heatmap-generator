import findDemoFiles from "./files";
import parse from "./parser";
import exportImage from "./overview/image";
import dotenv from "dotenv";
import { mkdirSync, existsSync } from "fs";

dotenv.config();

const { CSGO_DIRECTORY } = process.env;

async function generateHeatmaps(demo: string): Promise<void> {
    const parsed = await parse(demo, CSGO_DIRECTORY!);
    const mapName = parsed.mapData.name;

    console.log(`Finished parsing for ${demo}, generating heatmaps...`);

    const deathImage = await exportImage(CSGO_DIRECTORY!, mapName, parsed.deathPoints);
    const killImage = await exportImage(CSGO_DIRECTORY!, mapName, parsed.killPoints);

    await deathImage.writeAsync(`./exports/${mapName}-deaths.png`);
    await killImage.writeAsync(`./exports/${mapName}-kills.png`);

    console.log(`Finished generating heatmaps for ${demo}`);
}

async function start() {
    if (!CSGO_DIRECTORY) {
        console.error("Please specify the csgo directory in the .env file.");
        process.exit(1);
        return;
    }

    // Make sure we have the exports directory.
    if (!existsSync("./exports")) {
        mkdirSync("./exports");
    }

    const demos = findDemoFiles("./demos");

    const promises = demos.map(generateHeatmaps);
    Promise.all(promises).then(_ => console.log("Done."));
}

start();