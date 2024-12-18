module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo"]],
    plugins: [
      ["inline-import", { extensions: [".sql"] }],
      "react-native-reanimated/plugin",
    ],
    env: {
      production: {
        plugins: [
          "react-native-paper/babel",
          "react-native-reanimated/plugin",
          ["inline-import", { extensions: [".sql"] }],
        ],
      },
    },
  };
};
