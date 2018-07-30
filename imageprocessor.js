import { rgbaToInt, intToRGBA } from 'jimp'
import converter from 'hsl-to-rgb-for-reals'

const applyHeatmapFilter = (image, unfilteredPoints) => {
    let maxTemperature = 0

    for(let x = 0; x < 1024; x++){
        for(let y = 0; y < 1024; y++){
            let temperature = computeTemperature(x, y, unfilteredPoints)
            
            maxTemperature = Math.max(maxTemperature, temperature)
        }
    }

    for(let x = 0; x < 1024; x++){
        for(let y = 0; y < 1024; y++){
            let factor = Math.max(0, Math.min(1, 0.35 + 0.0041935483871 * (unfilteredPoints.length - 20)))

            let temperature = computeTemperature(x, y, unfilteredPoints)
            let relativeTemperature = factor * (temperature / maxTemperature)

            let color = intToRGBA(image.getPixelColor(x, y))
            let dstColor = convertHSB({ h: 0.7 - (0.7 * relativeTemperature), s: 1, b: relativeTemperature })        

            image.setPixelColor(toHex(blend(color, dstColor, relativeTemperature)), x, y)
        }
    }
}

const computeTemperature = (x, y, unfilteredPoints) => {
    let temperature = 0

    const dataPoints = unfilteredPoints

    dataPoints.forEach(point => {
        let deltaX = (x - point.x)
        let deltaY = (y - point.y)

        let distance = deltaX * deltaX + deltaY * deltaY

        temperature += 1 / (distance + 60)
    })

    return temperature
}

const blend = (src, dst, alpha) => {
    return clampColor({
        r: (src.r * (1 - alpha)) + (dst.r * alpha),
        g: (src.g * (1 - alpha)) + (dst.g * alpha),
        b: (src.b * (1 - alpha)) + (dst.b * alpha),
        a: 255
    })
}

const clampColor = (color) => {
    return {
        r: clamp(color.r, 0, 255),
        g: clamp(color.g, 0, 255),
        b: clamp(color.b, 0, 255),
        a: clamp(color.a, 0, 255),
    }
}

const clamp = (num, min, max) => num <= min ? min : num >= max ? max : num

const convertHSB = (hsb) => {
    let rgb = converter(hsb.h * 360, hsb.s, 0.5)

    return { r: rgb[0], g: rgb[1], b: rgb[2], a: 255 }
}

const toHex = (color) => rgbaToInt(color.r, color.g, color.b, color.a)

export { applyHeatmapFilter }