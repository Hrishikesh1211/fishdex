module.exports = function (api) {
  api.cache(false);

  const { expoRouterBabelPlugin } = require("expo/node_modules/babel-preset-expo/build/expo-router-plugin");

  return {
    presets: ["babel-preset-expo", "nativewind/babel"],
    plugins: [expoRouterBabelPlugin],
  };
};
