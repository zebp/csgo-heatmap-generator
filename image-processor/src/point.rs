pub struct Point {
    pub x: i16,
    pub y: i16
}

impl Point {

    pub fn load_points_from_vec(raw_points: Vec<u16>) -> Vec<Self> {
        let mut points = Vec::new();

        for i in 0..(raw_points.len() / 2) {
            let index = i * 2;

            points.push(Point {
                x: raw_points[index + 0] as i16,
                y: raw_points[index + 1] as i16
            });
        }

        points
    }

}