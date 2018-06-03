In this article, I will continue on from the work in my previous post, where I set up a webpack config from scratch for Vue. I will now add support for server side rendering, with `vue-server-renderer`. 

Server side rendering is where the HTML for the application is constructed dynamically by the server using Node.js. The newly rendered HTML is then sent back in the response. This is in contrast to client side rendering, where JavaScript bundled by Webpack is to the client as is, where it is processed by the browser JavaScript engine. There are benefits to both approaches, which will not be discussed in this post.

## Splitting `webpack.config.js`

A different webpack config is required, depending on whether the application is rendered on server or the client. We want to support both - for development, `webpack-dev-server` is a powerful tool, which delegates the processing and rendering to the client. In production, we will render on the server. A lot of the webpack config can be shared, such as `module`, where we declare `loaders`. Create a folder and two new files for the non unique webpack settings:

```
mkdir config && touch config/client.js config/server.js
```

The current `webpack.config.js` contains four properties:

1. entry
2. module
3. plugins
4. dev-server

`module` contains the loading rules for `.vue` files, which both server and client rendering requires. The rest of the properties will be unique the client rendering, so move them to `config/client.js`:

```js
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.js",

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "template.html")
    })
  ],

  devServer: {
    overlay: true
  }
}
```

Add a minimal setup in `config/server.js`:

```js
const path = require("path")

module.exports = {
}
```

Also, move `template.html` into `config`: 

````
mv template.html config/template.html
```

`npm run dev` shoud still work.

## `webpack-merge`

There is some duplication in `webpack.config.js` now. We have to join the base config and with client by typing

```js
plugins: [
  VueLoaderPlugin(), 
  config.HtmlWebpackPlugin: ...
]
```

When we add some server configuration, it will then look like:

```js
plugins: [
  VueLoaderPlugin(), 
]

if (development) 
  plugins.push(HtmlWebpackPlugin)
else if (production) 
  plugins.push(some production only plugin...)
```

This gets confusing very quickly. There is a better way: `webpack-merge`, which will handle the merging for us.

```
npm install webpack-merge --save
```

Now use `webpack-merge` to clean up `webpack.config.js`:

```js
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const merge = require("webpack-merge")
const clientConfig = require("./config/client")
const serverConfig = require("./config/server")

const commonConfig = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
  ]
}

module.exports = mode => {
  if (mode === "development") {
    return merge(commonConfig, clientConfig, {mode})
  }

  if (mode === "production") {
    return merge(commonConfig, serverConfig, {mode})
  }
}
```

Now `module.exports` returns a function. Webpack checks for the presence of a function exported from `webpack,config.js`, and if it is one, calls it with a `mode` argument. `mode`, oddly enough, corresponds to the `--env` argument, not `--mode`, so update the `scripts` section in `package.json`:

```js
"scripts": {
  "build": "npx webpack --env production",
  "dev": "npx webpack-dev-server --env development"
 }
```

`npm run dev` should still be working fine. If you visit `localhost:8080`, inspect the source of the page (not using the devtools, the actual page source) you should see:


```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <div id="app"></div>
<script type="text/javascript" src="main.js"></script></body>
</html>
```

Notice the `msg`, `Hello` does not appear here - that is because it is rendered on the *client*. We will see a different page source when rendering on the server.

## A second `entry`

The server rendering bundle will use a different entry point. Create a file for it:

```
touch src/create-app.js
```

This fuction will create the Vue app which we want to render. Add the following code:

```js
import Vue from "vue"
import Hello from "./Hello.vue"

export function createApp() {
  return new Vue({
    el: "#app",
    render: h => h(Hello)
  })
}
```

Look familiar? It is similar to the code in `src/index.js`. Take a look:

```js
import Vue from "vue"
import Hello from "./Hello.vue"

document.addEventListener("DOMContentLoaded", () => {
  new Vue({
    el: "#app",
    
    render: h => h(Hello)
  })
})
```

The difference is `document.addEventListener...`. `document` and the other Web APIs are not available in Node.js, which is why we need two different renderers. Refactor `src/index.js`:

```js
import {createApp} from "./create-app"

document.addEventListener("DOMContentLoaded", () => {
  createApp()
})
```

Let's try out new production config.

```
npm run build
```
