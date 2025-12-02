document.addEventListener("DOMContentLoaded", () => {
    console.log("Kalker App Loaded");
    if (typeof SpixiAppSdk !== 'undefined') {
        SpixiAppSdk.init();
    } else {
        console.warn("SpixiAppSdk not found");
    }

    // --- Responsive Scaling Logic ---
    function scaleCalculator() {
        const body = document.querySelector('.calculator-body');
        const container = document.querySelector('.calculator-container');
        if (!body || !container) return;

        // Target dimensions of the calculator chassis
        const targetWidth = 380;
        const targetHeight = 700;
        const padding = 20;

        // Available space
        const availableWidth = window.innerWidth - padding;
        const availableHeight = window.innerHeight - padding;

        // Calculate scale to fit
        const scaleX = availableWidth / targetWidth;
        const scaleY = availableHeight / targetHeight;
        const scale = Math.min(1, Math.min(scaleX, scaleY)); // Max scale 1 (don't upscale)

        body.style.transform = `scale(${scale})`;
        body.style.transformOrigin = 'center center';
    }

    // Scale on load and resize
    window.addEventListener('resize', scaleCalculator);
    scaleCalculator();

    // --- Button Event Listeners ---
    const keys = document.querySelectorAll('.btn');
    const kalk = document.querySelector('kalk-calculator');

    keys.forEach(key => {
        key.addEventListener('click', () => {
            const keyValue = key.getAttribute('data-key');
            handleInput(keyValue);

            // Visual feedback
            key.style.transform = "translate(1px, 1px)";
            setTimeout(() => {
                key.style.transform = "none";
            }, 100);
        });
    });

    function handleInput(key) {
        if (!kalk) return;

        // Find the input field within the shadow DOM or light DOM
        let inputField = kalk.shadowRoot ? kalk.shadowRoot.querySelector('textarea') : kalk.querySelector('textarea');

        // If not found, try to find it by class if structure is different
        if (!inputField) {
            inputField = document.querySelector('.input');
        }

        if (!inputField) {
            console.error("Could not find input field");
            return;
        }

        inputField.focus();

        if (key === 'Enter') {
            // Simulate Enter key press - dispatch to input and window
            const eventInit = {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
                view: window
            };

            inputField.dispatchEvent(new KeyboardEvent('keydown', eventInit));
            inputField.dispatchEvent(new KeyboardEvent('keypress', eventInit));
            inputField.dispatchEvent(new KeyboardEvent('keyup', eventInit));

            // Also try dispatching to the component itself
            kalk.dispatchEvent(new KeyboardEvent('keydown', eventInit));
        } else if (key === 'CLEAR') {
            inputField.value = '';
            // Trigger input event to update state
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (key === 'DEL') {
            inputField.value = inputField.value.slice(0, -1);
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (key === 'ArrowLeft') {
            // Move cursor left
            const start = inputField.selectionStart;
            inputField.setSelectionRange(Math.max(0, start - 1), Math.max(0, start - 1));
        } else if (key === 'ArrowRight') {
            // Move cursor right
            const start = inputField.selectionStart;
            inputField.setSelectionRange(Math.min(inputField.value.length, start + 1), Math.min(inputField.value.length, start + 1));
        } else {
            // Insert text
            const start = inputField.selectionStart;
            const end = inputField.selectionEnd;
            const text = inputField.value;
            const before = text.substring(0, start);
            const after = text.substring(end, text.length);

            inputField.value = before + key + after;
            inputField.selectionStart = inputField.selectionEnd = start + key.length;

            // Trigger input event
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
});
