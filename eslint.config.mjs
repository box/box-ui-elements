import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import babelParser from "@babel/eslint-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/build/",
        "**/dist/",
        "**/es/",
        "**/flow/",
        "flow-typed/npm/",
        "i18n/**/*",
        "**/node_modules/",
        "**/reports/",
        "**/styleguide/",
        "**/__tests__/**/*",
        "**/test/",
        ".storybook",
        "eslint.config.mjs",
    ],
}, ...compat.extends(
    "./node_modules/@box/frontend/eslint/base.js",
    "./node_modules/@box/frontend/eslint/react.js",
    "./node_modules/@box/frontend/eslint/typescript.js",
), {
    rules: {
        camelcase: "off",
        "class-methods-use-this": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "import/no-extraneous-dependencies": "off",
        "react/default-props-match-prop-types": "off",
        "react/destructuring-assignment": "off",
        "react/forbid-prop-types": "off",
        "react/jsx-sort-props": "off",
        "react/jsx-no-bind": "off",
        "react/sort-comp": "off",
        "react/no-unused-prop-types": "off",
        "react/no-access-state-in-setstate": "off",
        "react/no-array-index-key": "off",
        "react/no-this-in-sfc": "off",
        "import/no-unresolved": "off",
        "no-unused-expressions": "off",
        "import/no-named-as-default": "off", //complaining about using classes as a type
        "import/no-named-as-default-member": "off",
        "no-undef": "off", // complaining about typescript types not defined
        "no-promise-executor-return": "off", // complaining about return value cannot be read?
        "import/export": "off", // complaining you cannot re-export a file that is not a module
        "no-dupe-class-members": "off", // complaining about duplicate class members
        "react-hooks/exhaustive-deps": "off", // complaining that a debounce or something is directly in the hooks
    },
}, {
    files: ["**/*.test.js", "**/*.test.tsx"],

    languageOptions: {
        globals: {
            BoxVisualTestUtils: true,
            shallow: true,
            mount: true,
        },
        parser: babelParser
    },
}, {
    files: ["**/*.ts", "**/*.tsx"],

    rules: {
        "flowtype/no-types-missing-file-annotation": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",

        "@typescript-eslint/ban-types": ["error", {
            types: {
                Function: false,
                Object: false,
                object: false,
                "{}": false,
            },
        }],

        "no-use-before-define": "off",
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/no-use-before-define": ["error"],

        "@typescript-eslint/ban-ts-comment": ["error", {
            "ts-expect-error": "allow-with-description",
            "ts-ignore": "allow-with-description",
            "ts-nocheck": "allow-with-description",
            "ts-check": "allow-with-description",
            minimumDescriptionLength: 1,
        }],

        camelcase: "error",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": ["error"],
        "@typescript-eslint/no-unused-expressions": "error",
    },
}];
