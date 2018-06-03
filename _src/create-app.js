import Vue from "vue"
import App from "./Hello.vue"

export function createApp() {
  return new Vue({
    render: h => h(App)
  })
}

