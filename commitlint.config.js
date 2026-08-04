const base = require('@box/frontend/commitlint/commitlint.config.js');

module.exports = {
    ...base,
    ignores: [...(base.ignores || []), message => /Signed-off-by:\s*dependabot\[bot\]/i.test(message)],
};
