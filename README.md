In this article, I will show how to prepare a minimal webpack setup to develop Vue apps, complete with `webpack-dev-server` and hot reload.

First, start of with an empty `package.json` by running `echo {} >> package.json`.

Next, we need to install webpack, the cli tool and the dev server with 

```bash
npm install webpack webpack-cli webpack-dev-server
```

Before going any further, run `npx webpack`. `npx` is a tool to execute binaries - webpack created one for us, located in `node_modules/.bin/webpack`.

We get two errors:

```
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/concepts/mode/

ERROR in Entry module not found: Error: Can't resolve './src' in '/Users/lachlanmiller/javascript/vue/webpack-simple'
```

The first one is complaining about the `mode` option - default is `production`. Let's fix that, and also add an npm script to `package.json` at the same time:

```js
"scripts": {
  "dev": "npx webpack --mode development"
}
```

Now we have one more error - `Can't resolve './src'`. So let's make `src` with `mkdir src`, then `touch src/index.js`. Now `npm run dev` yields:

```bash

Hash: 52bc792a675c1ee221f2
Version: webpack 4.10.2
Time: 71ms
Built at: 2018-05-30 23:58:42
  Asset      Size  Chunks             Chunk Names
main.js  3.77 KiB    main  [emitted]  main
Entrypoint main = main.js
[./src/index.js] 0 bytes {main} [built]
```

It also created `dist/main.js`. Take a look - it contains about a hundred lines of webpack boilerplate, and nothing else, since `src/index.js` is empty at the moment.

### Making a `webpack.config.js`

The next step is to create a config file to store our webpack settings. Let's use the default, `webpack.config.js`. Create that at root level. Before going any further, we will add a plugin, `HtmlWebpackPlugin`, by running `npm install html-webpack-plugin`. This plugin lets us create a default `index.html`. and load the webpack bundle. Our `index.html` will need an `<div id="app"></div>` for the Vue appplication to mount. Create the template first, called `template.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

Now inside of `webpack.config.js`, add the first lines of the webpack config:

```js
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.js",

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "template.html")
    })
  ]
}
```

We specify the entry - normally you specify the `output` too, but if you don't, it defaults to `dist/main.js`. We imported the plugin, and passed the template we want to use. Running `npm run dev` yields the following output:

```bash
Hash: dae6c53437d700ae34a8
Version: webpack 4.10.2
Time: 410ms
Built at: 2018-05-31 00:10:02
     Asset       Size  Chunks             Chunk Names
   main.js   3.77 KiB    main  [emitted]  main
index.html  191 bytes          [emitted]
Entrypoint main = main.js
```

A bunch more stuff, of which the some I omitted, is printed. Notice we now have `index.html` - take a look in `dist/index.html`.

### Adding Vue

Finally, it is time to add Vue with `npm install vue`. Node.js does not support `import` and `export` by default (as of 10.3 it does, __experimentally__, more [here](https://nodejs.org/api/esm.html)). Webpack, however, does (I'm not exactly sure how, perhaps using babel internally?). Anyway, that means we can use `import` and `export`! Update `src/index.js`:

```js
import Vue from "vue"

document.addEventListener("DOMContentLoaded", () => {
  new Vue({
    el: "#app",
    
    data() {
      return {
        msg: "Hello"
      }
    },

    template: "<div>{{ msg }}</div>"
  })
})
```

Now run `npm run dev`. We now see:

```sh
Hash: 9c0afed8a7477e9712d1
Version: webpack 4.10.2
Time: 645ms
Built at: 2018-05-31 00:23:36
     Asset       Size  Chunks             Chunk Names
   main.js    317 KiB    main  [emitted]  main
index.html  191 bytes          [emitted]
```

Now `main.js` is 317 kb! That's HUGE! Mainly because we are using the full build of Vue, without any minifying and so forth. It's okay for now. Run a server in `dist`, for example on MacOS you can do `cd dist && python -m SimpleHTTPServer`, and visiting `localhost:8000` should yield this error in the console:

```
[Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.
```

This is because are using a `template` to construct our Vue app - the compiler which converts `template` into HTML and JavaScript is not available when using the runtime-only build (`import Vue from "vue"`). We need to use compiler included build, for now. We will fix this soon. Instead using `import Vue from "vue/dist/vue.esm.js"`, and run `npm run dev` once again. Now you should see "Hello" displayed.
