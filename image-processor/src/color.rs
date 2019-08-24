pub struct Color {
    pub red: u8,
    pub green: u8,
    pub blue: u8,
    pub alpha: u8,
}

impl Color {
    pub fn from_buffer(buffer: Vec<u8>) -> Vec<Self> {
        let mut colors = Vec::new();

        for i in 0..(buffer.len() / 4) {
            let index = i * 4;

            colors.push(Color::from_rgba(
                buffer[index + 0],
                buffer[index + 1],
                buffer[index + 2],
                buffer[index + 3],
            ))
        }

        colors
    }

    pub fn from_rgba(red: u8, green: u8, blue: u8, alpha: u8) -> Self {
        Color {
            red,
            green,
            blue,
            alpha,
        }
    }

    pub fn from_hsb(hue: f32, saturation: f32, brightness: f32) -> Self {
        let i = (hue * 6.0).floor();
        let f = hue * 6.0 - i;
        let p = brightness * (1.0 - saturation);
        let q = brightness * (1.0 - f * saturation);
        let t = brightness * (1.0 - (1.0 - f) * saturation);

        let mut r = 0.0;
        let mut g = 0.0;
        let mut b = 0.0;

        match i as u8 {
            0 => { r = brightness; g = t; b = p; },
            1 => { r = q; g = brightness; b = p; },
            2 => { r = p; g = brightness; b = t; },
            3 => { r = p; g = q; b = brightness; },
            4 => { r = t; g = p; b = brightness; },
            5 => { r = brightness; g = p; b = q; },
            _ => {}
        }

        Color::from_rgba((r * 255.0) as u8, (g * 255.0) as u8, (b * 255.0) as u8, 255)
    }

    pub fn blend(&self, other: &Color, factor: f32) -> Color {
        Color {
            red: blend(self.red, other.red, factor),
            green: blend(self.green, other.green, factor),
            blue: blend(self.blue, other.blue, factor),
            alpha: blend(self.alpha, other.alpha, factor),
        }
    }
}

fn blend(a: u8, b: u8, factor: f32) -> u8 {
    let inv_factor = 1.0 - factor;
    ((inv_factor * a as f32) + (factor * b as f32)) as u8
}
