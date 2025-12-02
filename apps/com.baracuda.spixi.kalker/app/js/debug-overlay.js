(function () {
    // Create debug overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '50%'; // Top half
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.color = '#0f0';
    overlay.style.fontFamily = 'monospace';
    overlay.style.fontSize = '12px';
    overlay.style.overflowY = 'scroll';
    overlay.style.zIndex = '9999';
    overlay.style.padding = '10px';
    overlay.style.pointerEvents = 'none'; // Let clicks pass through
    document.body.appendChild(overlay);

    function logToOverlay(type, args) {
        const line = document.createElement('div');
        line.textContent = `[${type}] ${Array.from(args).map(a =>
            typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
        ).join(' ')}`;
        if (type === 'ERROR') line.style.color = '#f00';
        if (type === 'WARN') line.style.color = '#ff0';
        overlay.appendChild(line);
        overlay.scrollTop = overlay.scrollHeight;
    }

    // Capture console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = function () {
        originalLog.apply(console, arguments);
        logToOverlay('LOG', arguments);
    };

    console.error = function () {
        originalError.apply(console, arguments);
        logToOverlay('ERROR', arguments);
    };

    console.warn = function () {
        originalWarn.apply(console, arguments);
        logToOverlay('WARN', arguments);
    };

    // Capture unhandled errors
    window.addEventListener('error', function (event) {
        logToOverlay('ERROR', [event.message, event.filename, event.lineno, event.colno, event.error]);
    });

    window.addEventListener('unhandledrejection', function (event) {
        logToOverlay('ERROR', ['Unhandled Rejection:', event.reason]);
    });

    logToOverlay('INFO', ['Debug overlay initialized']);
})();
