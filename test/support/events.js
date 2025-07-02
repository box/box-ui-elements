// eslint-disable-next-line consistent-return
Cypress.on('uncaught:exception', error => {
    // AbortError is not a clear indication of a test failure. XHR or DOM operations may abort based on user interactions or state changes.
    if (error.name === 'AbortError') {
        return false;
    }
});
