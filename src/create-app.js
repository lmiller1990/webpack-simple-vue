import Vue from "vue"
import App from "./Hello.vue"

export function createApp() {
  return new Vue({
    el: "#app",
    render: h => h(App)
  })
}

