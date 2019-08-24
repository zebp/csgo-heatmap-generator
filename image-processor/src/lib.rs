mod point;
mod color;

use wasm_bindgen::prelude::*;
use point::*;
use color::*;

#[wasm_bindgen]
pub fn process(pixel_buffer: Vec<u8>, raw_points: Vec<u16>, length: usize) -> Vec<u8> {
    let points = Point::load_points_from_vec(raw_points);
    let mut pixels = Color::from_buffer(pixel_buffer);

    let mut max_temperature = 0.0;
    let mut temperatures = vec![0.0; length * length];

    for y in 0..length {
        for x in 0..length {
            let temperature = compute_temperature(x as i16, y as i16, &points);
            max_temperature = temperature.max(max_temperature);

            temperatures[((y * length) + x) as usize] = temperature;
        }
    }

    for y in 0..length {
        for x in 0..length {
            let index = y * 1024 + x;

            let factor = 0f32.max(1f32.min(0.35 + 0.0041935483871 * (points.len() as f32 - 20.0)));

            let temperature = temperatures[index];
            let relative_temperature = factor * (temperature / max_temperature);

            let color: &Color = &pixels[index];
            let dst_color = Color::from_hsb(0.7 - (0.7 * relative_temperature), 1.0, relative_temperature);        

            pixels[index] = color.blend(&dst_color, relative_temperature);
        }
    }

    let mut buffer: Vec<u8> = Vec::new();

    for pixel in pixels {        
        buffer.push(pixel.red);
        buffer.push(pixel.green);
        buffer.push(pixel.blue);
        buffer.push(pixel.alpha);
    }

    buffer
}

pub fn compute_temperature(x: i16, y: i16, points: &Vec<Point>) -> f32 {
    points.into_iter().fold(0.0, |acc, point: &Point| {
        let delta_x = x as i32 - point.x as i32;
        let delta_y = y as i32 - point.y as i32;

        let distance = (delta_x * delta_x + delta_y * delta_y) as f32;

        acc + 1.0 / (distance + 120.0)
    })
}