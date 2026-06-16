module.exports = {
    '*.{js,ts,tsx}': ['prettier --write', 'eslint --fix'],
    '*.md': ['prettier --write --parser=markdown'],
    '*.json': ['prettier --write --parser=json'],
    '*.html': ['prettier --write --parser=html'],
    '*.scss': ['prettier --write --parser=scss', 'stylelint --fix'],
    '*.css': ['prettier --write --parser=css', 'stylelint --fix'],
};
