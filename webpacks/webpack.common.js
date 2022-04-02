// eslint-disable-next-line
const path = require("path");
// eslint-disable-next-line
const CopyPlugin = require("copy-webpack-plugin");

const srcDir = path.join(__dirname, "..", "src");

const entryPath = (names) => {
  let pathArray = {};
  for (const name of names) {
    pathArray[name] = path.join(srcDir, `${name}/${name}.ts`);
  }
  return pathArray;
};

module.exports = {
  entry: {
    popup: path.join(srcDir, "popup/popup.tsx"),
    options: path.join(srcDir, "options/options.tsx"),
    background: path.join(srcDir, "background/background.ts"),
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "../dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".html"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }],
      options: {},
    }),
  ],
  experiments: {
    topLevelAwait: true,
  },
};
