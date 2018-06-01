const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.js",

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(path.join(__dirname, "../src/template.html")),
    })
  ],

  devServer: {
    overlay: true
  }
}
