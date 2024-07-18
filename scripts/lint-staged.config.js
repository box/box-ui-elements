module.exports = {
    '*.{js,ts,tsx}': ['eslint --fix', 'git add'],
    '*.md': ['prettier --write --parser=markdown', 'git add'],
    '*.json': ['prettier --write --parser=json', 'git add'],
    '*.html': ['prettier --write --parser=html', 'git add'],
    '*.scss': ['prettier --write --parser=scss', 'stylelint --syntax scss --fix', 'git add'],
    '*.css': ['prettier --write --parser=css', 'stylelint --syntax css --fix', 'git add'],
};
