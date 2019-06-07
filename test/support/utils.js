// Useful when using cy.contains() to get an element.
// In some cases, not using this function will lead to
// collisions with other text on the page.

const utils = {
    getExactRegex(str) {
        return new RegExp(`^${str}$`);
    },
};
export default utils;
