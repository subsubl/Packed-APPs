const config = {
    type: Phaser.AUTO,
    width: 320, // Low res for retro feel
    height: 240,
    zoom: 3, // Scale up
    parent: 'game-container',
    backgroundColor: '#2b2b2b',
    pixelArt: true, // Crucial for pixel art
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

// --- Game State ---
const gameState = {
    inventory: [],
    flags: {
        hasKey: false,
        cabinetOpen: false
    }
};

function preload() {
    // Placeholder for assets
    // this.load.image('bg_waiting_room', 'img/bg_waiting_room.png');
}

function create() {
    // Initialize Scene
    this.add.text(10, 10, "The Case of the\nMissing Molar", {
        fontFamily: 'Courier New',
        fontSize: '16px',
        fill: '#c2b280' // Sepia gold
    });

    this.add.text(10, 50, "Click to investigate...", {
        fontFamily: 'Courier New',
        fontSize: '10px',
        fill: '#8a7f70'
    });
}

function update() {
    // Game loop
}
