(function () {
    console.log("Initializing Fetch Polyfill for WASM");

    // Backup original fetch
    const originalFetch = window.fetch;

    // Disable instantiateStreaming to force fallback to arrayBuffer() path
    // This is necessary because instantiateStreaming is strict about MIME types and headers
    // which are hard to mock perfectly with XHR on file://
    if (WebAssembly) {
        delete WebAssembly.instantiateStreaming;
        delete WebAssembly.compileStreaming;
    }

    window.fetch = function (url, options) {
        // Check if it's the WASM file (or any WASM file)
        if (typeof url === 'string' && url.endsWith('.wasm')) {
            console.log("Intercepting WASM fetch:", url);
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'arraybuffer';

                xhr.onload = function () {
                    if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
                        console.log("WASM loaded via XHR");
                        resolve({
                            ok: true,
                            status: 200,
                            statusText: 'OK',
                            headers: new Headers(),
                            url: url,
                            arrayBuffer: () => Promise.resolve(xhr.response),
                            text: () => Promise.resolve(new TextDecoder().decode(xhr.response)),
                            json: () => Promise.reject("Cannot parse WASM as JSON"),
                            blob: () => Promise.resolve(new Blob([xhr.response]))
                        });
                    } else {
                        reject(new TypeError('Failed to fetch (XHR status ' + xhr.status + ')'));
                    }
                };

                xhr.onerror = function () {
                    reject(new TypeError('Failed to fetch (XHR error)'));
                };

                xhr.send(null);
            });
        }

        // Fallback to original fetch for other resources
        return originalFetch.apply(this, arguments);
    };
})();
