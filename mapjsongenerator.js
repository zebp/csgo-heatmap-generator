import { readdirSync, readFile, writeFile } from 'fs'

const regex = /'(\w*)'\s+'(.*)'/gm

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

    let match;

    while ((match = regex.exec(str)) !== null) {
        if (match.index === regex.lastIndex)
            regex.lastIndex++

        output[match[1]] = match[2] // Adds data from the map file into the json object.
    }

    return JSON.stringify(output, null, 4) // four spaces best spaces
}