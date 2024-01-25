const config = {
  mode: "production",
  entry: {
    main: "./src/js/main.js",
    api: "./src/js/api.js",
    renderApp: "./src/js/renderApp.js",
  },
  output: {
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

module.exports = config;
