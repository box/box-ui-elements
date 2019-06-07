const utils = {
    // Useful when using cy.contains() to get an element.
    // In some cases, not using this function will lead to
    // collisions with other text on the page.
    getExactRegex(str) {
        return new RegExp(`^${str}$`);
    },
};
export default utils;
