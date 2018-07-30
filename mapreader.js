import { readFileSync } from 'fs'

const fetchMapRaw = (mapName) => JSON.parse(readFileSync(`./overlay_json/${ mapName }.json`, 'utf8'))

const fetchMapData = (mapName) => {
    let raw = fetchMapRaw(mapName)

    return {
        x: raw.pos_x,
        y: raw.pos_y,
        scale: raw.scale
    }
}

export { fetchMapData }