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
        project: ["./tsconfig.base.json", "./packages/*/tsconfig.json"]
    },
    plugins: ["@typescript-eslint", "simple-import-sort", "@stylistic"],
    rules: {
        "quotes": ["warn", "double"],
        "semi": ["warn", "always"],
        "simple-import-sort/imports": "warn",
        "@stylistic/arrow-parens": ["warn", "as-needed"],
        "@stylistic/eol-last": ["warn", "always"],
        "@stylistic/comma-dangle": ["warn", "always-multiline"],
        "@stylistic/indent": ["warn", 4],
        "@stylistic/newline-per-chained-call": ["warn", { "ignoreChainWithDepth": 1 }],
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-namespace": "off",
    }
};
