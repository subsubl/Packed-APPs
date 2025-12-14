# DoomWASM Spixi Mini-App

A Spixi mini-app that runs the classic DOOM game using WebAssembly technology, powered by the Cloudflare doom-wasm port.

## Features
- Classic DOOM gameplay experience
- WebAssembly-powered performance
- Integrated with Spixi SDK
- Single-player mode
- Full keyboard controls

## Controls
- **Arrow Keys**: Move forward/backward, turn left/right
- **Ctrl**: Fire weapon
# DoomWASM Spixi Mini-App

A Spixi mini-app that runs the classic DOOM game using WebAssembly technology, powered by the Cloudflare doom-wasm port.

## Features
- Classic DOOM gameplay experience
- WebAssembly-powered performance
- Integrated with Spixi SDK
- Single-player mode
- Full keyboard controls

## Controls
- **Arrow Keys**: Move
- **Ctrl**: Fire / Action
- **Space**: Open / Use
- **Esc**: Menu / Back
- **Fullscreen**: Click the "Fullscreen" button for immersive play

## Technical Details

This app uses **js-dos**, a DOS emulator for the browser, to run the game. It is configured to load a local `.jsdos` bundle file and local emulator binaries.

- **Emulator**: js-dos v7 (local binaries)
- **Emulator Files**: `app/wdosbox.js`, `app/wdosbox.wasm`
- **Game Bundle**: Located in `app/games/doom.jsdos`
- **Current Game**: DOOM Shareware v1.9



## Development

The app structure is simple:
- `index.html`: Main entry point
- `js/app.js`: Handles initialization and js-dos loading
- `css/style.css`: Retro styling
- `games/`: Directory for game bundles

## App Information
- **App ID**: com.ixilabs.spixi.doomwasm
- **Publisher**: IXI Labs
- **Version**: 1.0.0

## Development Notes
This app integrates the Chocolate Doom WASM port with the Spixi mini-app platform, allowing users to play DOOM directly within the Spixi chat environment.

## Future Enhancements
- Multiplayer support via Spixi P2P messaging
- Save/load game states using SpixiTools storage
- Touch controls for mobile devices
- Custom WAD file support
