import { readdirSync, readFile, writeFile } from 'fs'

const regex = /"\s+"(.+)"\s+"(.*)".+/gm

let files = readdirSync('./overlay_info/')

// Yucky callbacks!
files.forEach(file => {
    readFile(`./overlay_info/${ file }`, 'utf8', (err, data) => {
        file = file.replace(/txt/g, 'json')

        writeFile(`./overlay_json/${ file }`, generateJson(data), (err) => {
            if(err)
                return console.log(err)
        
            console.log(`Saved ${ file }`)
        });
    })
})

function generateJson(str){
    let output = {}

    str.split("\n").forEach(line => {
        const found = line.replace(/\r/g, "").split(/\t/).filter(segment => segment.length > 0).map(segment => segment.replace(/"/g, ""))
        
        if (found.length >= 2) {
            output[found[0]] = found[1]
        }
    })

    return JSON.stringify(output, null, 4) // four spaces best spaces
}