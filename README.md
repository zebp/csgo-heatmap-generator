# csgo-heatmap-generator
A NodeJS program to generate heatmaps of kills and deaths from Counter-Strike: Global Offensive Demos

## Usage


### Setting up env

1. Make sure you set your csgo directory location in a file called `.env`.
2. Move any demos you want to generate heatmaps for into the `demos` directory.

### Running

```sh
$ npm install
$ npm run build
$ npm run start
```

## Compiling the WebAssembly

### Ensure you have wasm-pack installed

If not you can install it with
```sh
$ cargo install wasm-pack
```

### Building

```sh
$ cd image-processor
$ wasm-pack build
```