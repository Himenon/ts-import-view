module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  extends: ["plugin:@typescript-eslint/recommended", "plugin:import/typescript"],
  rules: {
    "@typescript-eslint/no-floating-promises": 2,
    "@typescript-eslint/triple-slash-reference": [2, { path: "never", types: "never", lib: "never" }],
    "@typescript-eslint/no-unnecessary-qualifier": 2,
    "@typescript-eslint/no-unnecessary-condition": [2, { ignoreRhs: true }],
    "@typescript-eslint/unified-signatures": 2,
    "no-undef": 0,
    "no-redeclare": 0,
    "import/export": 0,
    "import/named": 0,
    "import/no-unresolved": 0,
    "import/namespace": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/no-namespace": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-empty-interface": 0,

    "@typescript-eslint/camelcase": 0,
    "react/prop-types": 0,
    "@typescript-eslint/no-unnecessary-qualifier": 0,
    "@typescript-eslint/no-use-before-define": 1,
    "@typescript-eslint/no-unnecessary-condition": 1,
  },
};
