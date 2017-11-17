import regeneratorRuntime from 'regenerator-runtime'; // Puts regeneratorRuntime into global scope for async/await

// Add regeneratorRuntime to global scope for async/await support
if (!window.regeneratorRuntime) {
    window.regeneratorRuntime = regeneratorRuntime;
}
