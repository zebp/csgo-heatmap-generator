import { readFileSync } from "fs";
import parseOverlayInformation from "./overview/overlay";

// demofile doesn't have typescript declarations even though it's written in typescript.
const { DemoFile } = require("demofile");

export type DemoResult = {
    demoPath: string,
    mapData: MapData,
    killPoints: Point[],
    deathPoints: Point[]
}

export type Point = {
    x: number,
    y: number
}

export type MapData = {
    name: string
    x: number,
    y: number,
    scale: number,
}

export default function parse(demoPath: string, csgoDirectory: string): Promise<DemoResult> {
    let result: DemoResult = {
        demoPath,
        mapData: {
            name:"",
            x: 0,
            y: 0,
            scale: 0
        },
        killPoints: [],
        deathPoints: []
    };
    
    return new Promise<DemoResult>((resolve, reject) => {
        let demo = new DemoFile();

        demo.on("end", () => resolve(result));

        demo.gameEvents.on("player_death", (event: any) => {
            const victim = demo.entities.getByUserId(event.userid);
            const attacker = demo.entities.getByUserId(event.attacker);

            pushDeathPoint(result.deathPoints, victim, result.mapData);
            pushDeathPoint(result.killPoints, attacker, result.mapData);
        });

        demo.on("start", async () => {
            console.log(`Parsing ${demo.header.mapName}...`);

            const overlayInfo = await parseOverlayInformation(csgoDirectory, demo.header.mapName);
            result.mapData = {
                name: demo.header.mapName,
                x: overlayInfo.pos_x,
                y: overlayInfo.pos_y,
                scale: overlayInfo.scale
            };
        });

        try {
            const buffer = readFileSync(demoPath);
            demo.parse(buffer);
        } catch (error) {
            reject(error);
        }
    });
}

function pushDeathPoint(points: Point[], player: any, mapData: MapData) {
    const { x, y } = player.position;

    const point = {
        x: Math.round((x + (0 - mapData.x)) / mapData.scale),
        y: Math.abs(Math.round((y + (0 - mapData.y)) / mapData.scale))
    };    

    points.push(point);
}