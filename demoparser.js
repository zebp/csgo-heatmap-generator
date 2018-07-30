import { DemoFile } from 'demofile'
import { readFileSync } from 'fs'
import { read } from 'jimp'
import { fetchMapData } from './mapreader'
import { applyHeatmapFilter } from './imageprocessor'
import { EventEmitter } from 'events'

class DemoParser extends EventEmitter {

    constructor() {
        super()

        this.demo = new DemoFile()
        this.mapData = {}
        this.points = []

        this.demo.on('start', () => this.start())
        this.demo.on('end', () => this.emit('end', this.demo.header.mapName, this.points))
        this.demo.gameEvents.on('player_death', (event) => this.playerDeath(event))
    }

    start() {
        this.mapData.name = this.demo.header.mapName
        this.mapData = fetchMapData(this.mapData.name)
    }

    playerDeath(event) {
        if (event.attacker === 0)
            return

        this.pushPoint(this.demo.entities.getByUserId(event.userid), 'victim')
        this.pushPoint(this.demo.entities.getByUserId(event.attacker), 'attacker')
    }

    pushPoint(player, type) {
        let pos = player.position

        this.points.push({
            player: type,
            name: player.name,
            x: Math.round((pos.x + (0 - this.mapData.x)) / this.mapData.scale),
            y: Math.abs(Math.round((pos.y + (0 - this.mapData.y)) / this.mapData.scale))
        })
    }

    read(file) {
        let buffer = readFileSync(file)

        this.demo.parse(buffer)
    }

    exportImage(output, points) {
        exportImage(output, this.demo.header.mapName, points)
    }

}

const exportImage = (output, type, mapName, points) => {
    points = points[type]

    console.log(`Processing ${mapName}-${type} with ${points.length} points.`)

    read(`./overlays/${mapName}_radar.png`)
        .then(image => {
            applyHeatmapFilter(image, points)

            image.write(output)
            console.log(`Wrote ${mapName}-${type} heatmap.`)
        })
        .catch(error => console.error(error))
}

const promisify = (file) => new Promise((resolve, reject) => {
    const parser = new DemoParser()

    parser.on('end', (mapName, points) => resolve({
        mapName: mapName,
        points: points
    }))

    parser.read(file)
})

export { DemoParser, exportImage, promisify }