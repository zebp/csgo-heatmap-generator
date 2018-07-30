import {  promisify, exportImage } from './demoparser'
import { readdirSync } from 'fs'

const pointMap = {}
const demos = readdirSync('./demos/')

const exportDemo = (demo) => new Promise((resolve, reject) => {
    console.log(`Processing ${ demo }.`)

    promisify(`./demos/${ demo }`)
        .then(result => {
            if (pointMap[result.mapName] == undefined)
                pointMap[result.mapName] = { 'victim': [], 'attacker': []}

            result.points.forEach(point => {
                pointMap[result.mapName][point.player].push(point)
            })

            resolve()
        })
        .catch(error => reject(error))
})

const promises = []

demos.forEach((demo) => promises.push(exportDemo(demo)))

Promise.all(promises)
    .then(() => Object.keys(pointMap).forEach(mapName => {
        exportImage(`./exports/${ mapName }-deaths.png`, 'attacker', mapName, pointMap[mapName])
        exportImage(`./exports/${ mapName }-kills.png`, 'victim', mapName, pointMap[mapName])
    }))