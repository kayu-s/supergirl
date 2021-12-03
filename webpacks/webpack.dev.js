// eslint-disable-next-line
const { merge } = require("webpack-merge");
// eslint-disable-next-line
const common = require("./webpack.common.js");


module.exports = merge(common, {
    devtool: "inline-source-map",
    mode: "development",
});
