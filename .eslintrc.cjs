module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: "detect" },
  },
  plugins: ["react", "react-hooks"],
  rules: {
    // 這批 bug 的根源：hook 順序與相依陣列
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // 專案使用新版 JSX transform，無須手動 import React
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",

    // 舊專案尚有大量未清理的變數，先以警告呈現避免一次性大量錯誤
    "no-unused-vars": "warn",
  },
};
