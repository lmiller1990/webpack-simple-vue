const path = require("path")

module.exports = {
  entry: "./src/create-app.js",

  output: {
    filename: "server-bundle.js",
    path: path.join(__dirname, "../dist")
  }
}
