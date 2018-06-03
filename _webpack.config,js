const merge = require("webpack-merge")

const VueLoaderPlugin = require("vue-loader/lib/plugin")

const clientConfig = require("./config/client")
const serverConfig = require("./config/server")

const commonConfig = merge([
  {
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader"
        }
      ]
    },

    plugins: [
      new VueLoaderPlugin()
    ] 
  }
])

const devConfig = merge([
  clientConfig
])

module.exports = mode => { 
  if (mode === "development") {
    return merge(commonConfig, clientConfig, { mode })
  } else if (mode === "production") {
    return merge(commonConfig, serverConfig, { mode })
  }
}
