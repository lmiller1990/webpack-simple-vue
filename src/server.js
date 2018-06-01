const fs = require("fs")
const path = require("path")
const express = require("express")
const {createApp} = require("../dist/server-bundle.js")

const renderer = require('vue-server-renderer').createRenderer({ 
  template: fs.readFileSync("./src/template.html", { encoding: "utf8" })
})

const server = express()

server.get("*", (req, res) => {
  const app = createApp()

  renderer.renderToString(app).then(html => {
    console.log(html)

    res.end(html)
  })
})

server.listen(8000, () => console.log("Started server"))
