const express = require("express")
const renderer = require("vue-server-renderer").createRenderer()
const {createApp} = require("../dist/main")

const server = express()

server.get("*", (req, res) => {
  const app = createApp()

  renderer.renderToString(app).then(html => {
    res.end(html)
  })
})

server.listen(8000, () => console.log("Started server"))
