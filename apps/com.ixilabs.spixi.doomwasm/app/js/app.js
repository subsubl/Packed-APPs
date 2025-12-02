/**
 * DoomWASM Spixi Mini App  
 * DOS game integration using js-dos emulator
 */

// Application state
const appState = {
    dosInstance: null,
    gameStarted: false,
    isFullscreen: false
};

// DOM elements
let statusOverlay;
let statusText;
let dosContainer;
let fullscreenBtn;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DoomWASM app initializing with js-dos...');

    // Get DOM elements
    statusOverlay = document.getElementById('status-overlay');
    statusText = document.getElementById('status-text');
    dosContainer = document.getElementById('dos');
    fullscreenBtn = document.getElementById('fullscreen-btn');

    // Initialize Spixi SDK
    initSpixiSDK();

    // Setup event listeners
    setupEventListeners();

    // Load game via js-dos
    loadGameWithJsDos();
});

/**
 * Initialize Spixi SDK
 */
function initSpixiSDK() {
    try {
        if (typeof SpixiAppSdk !== 'undefined') {
            SpixiAppSdk.init(function (data) {
                console.log('Spixi SDK initialized:', data);
                updateStatus('SDK Ready');
            });
        } else {
            console.warn('SpixiAppSdk not available');
        }
    } catch (error) {
        console.error('Error initializing Spixi SDK:', error);
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Fullscreen button
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // Escape key to exit fullscreen
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && appState.isFullscreen) {
            exitFullscreen();
        }
    });

    // Fullscreen change event
    document.addEventListener('fullscreenchange', function () {
        if (!document.fullscreenElement) {
            document.body.classList.remove('fullscreen');
            appState.isFullscreen = false;
            if (fullscreenBtn) {
                fullscreenBtn.textContent = '⛶ Fullscreen';
            }
        }
    });
}

/**
 * Update status message
 */
function updateStatus(message) {
    if (statusText) {
        statusText.textContent = message;
    }
    console.log('Status:', message);
}

/**
 * Hide status overlay
 */
function hideStatusOverlay() {
    if (statusOverlay) {
        statusOverlay.classList.add('hidden');
        setTimeout(() => {
            statusOverlay.style.display = 'none';
        }, 500);
    }
}

/**
 * Show error message
 */
function showError(message) {
    updateStatus('Error: ' + message);
    console.error(message);
    // Keep overlay visible with error
}

/**
 * Load game using js-dos
 */
async function loadGameWithJsDos() {
    try {
        updateStatus('Loading js-dos...');

        // Check if Dos is available
        if (typeof Dos === 'undefined') {
            throw new Error('js-dos library not loaded');
        }

        updateStatus('Initializing game...');

        // Create DOS instance
        // Configure to use local wdosbox.js in app root
        const dosInstance = Dos(document.getElementById('dos'), {
            wdosboxUrl: '/apps/com.ixilabs.spixi.doomwasm/app/wdosbox.js'
        });

        appState.dosInstance = dosInstance;

        updateStatus('Loading game files...');

        // Wait for the game to be ready (js-dos v7 API)
        // Pass the bundle URL to the run method
        dosInstance.run('/apps/com.ixilabs.spixi.doomwasm/app/games/doom.jsdos').then(() => {
            appState.gameStarted = true;
            updateStatus('DOOM Loaded! Rip and Tear!');

            // Hide status overlay after 3 seconds
            setTimeout(hideStatusOverlay, 3000);

            console.log('Game loaded successfully via js-dos');
        }).catch((error) => {
            console.error('Error running game:', error);
            showError('Failed to start game: ' + error.message);
        });

    } catch (error) {
        console.error('Error loading game:', error);
        showError('Failed to load game: ' + error.message);
    }
}

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    if (appState.isFullscreen) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
}

/**
 * Enter fullscreen mode
 */
function enterFullscreen() {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }

    document.body.classList.add('fullscreen');
    appState.isFullscreen = true;
    if (fullscreenBtn) {
        fullscreenBtn.textContent = '⛶ Exit Fullscreen';
    }
}

/**
 * Exit fullscreen mode
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msRequestFullscreen) {
        document.msExitFullscreen();
    }

    document.body.classList.remove('fullscreen');
    appState.isFullscreen = false;
    if (fullscreenBtn) {
        fullscreenBtn.textContent = '⛶ Fullscreen';
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function () {
    console.log('Game app unloading...');
    if (appState.dosInstance) {
        try {
            appState.dosInstance.stop();
        } catch (e) {
            console.error('Error stopping DOS instance:', e);
        }
    }
});

console.log('DoomWASM app script loaded (js-dos version with local bundle)');
