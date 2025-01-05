/* eslint-env node */
module.exports = {
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
            "./tsconfig.base.json", "./packages/*/tsconfig.json", "./tsconfig.lint.json",
        ],
    },
    plugins: [
        "@typescript-eslint", "simple-import-sort", "@stylistic", "import-newlines",
    ],
    rules: {
        "array-bracket-spacing": ["warn", "never"],
        "import-newlines/enforce": ["warn", { "items": 3, "semi": true }],
        "quotes": ["warn", "double"],
        "semi": ["warn", "always"],
        "simple-import-sort/imports": "warn",
        "@stylistic/array-bracket-newline": ["warn", { "minItems": 3, "multiline": true }],
        "@stylistic/array-element-newline": ["warn", { "consistent": true, "multiline": true }],
        "@stylistic/arrow-parens": ["warn", "as-needed"],
        "@stylistic/brace-style": ["warn", "1tbs"],
        "@stylistic/eol-last": ["warn", "always"],
        "@stylistic/comma-dangle": ["warn", "always-multiline"],
        "@stylistic/function-call-argument-newline": ["warn", "consistent"],
        "@stylistic/function-paren-newline": ["warn", "multiline-arguments"],
        "@stylistic/indent": ["warn", 4],
        "@stylistic/newline-per-chained-call": ["warn", { "ignoreChainWithDepth": 1 }],
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-namespace": "off",
    },
};
