/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * 
 * Copyright (c) 2019-2023, the Lingua Franca contributors.
 * All rights reserved.
 */

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:react-hooks/recommended',
        'plugin:regexp/recommended',
        'prettier',
        'plugin:@docusaurus/all',
    ],
    plugins: [
        'react-hooks',
        '@typescript-eslint',
        'regexp',
        '@docusaurus',
    ],
    rules: {
        'react/jsx-uses-react': OFF, // JSX runtime: automatic
        'react/react-in-jsx-scope': OFF, // JSX runtime: automatic
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ["tsconfig.json"]
    },
};