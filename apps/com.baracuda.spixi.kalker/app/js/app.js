document.addEventListener('DOMContentLoaded', function () {
    console.log('Kalker app initializing...');

    // Initialize Spixi SDK
    if (typeof SpixiAppSdk !== 'undefined') {
        SpixiAppSdk.init(function (data) {
            console.log('Spixi SDK initialized:', data);
        });
    } else {
        console.warn('SpixiAppSdk not available');
    }
});
