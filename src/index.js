import Vue from "vue/dist/vue.esm.js"
// import App from "./App.vue"

document.addEventListener("DOMContentLoaded", () => {
  new Vue({
    el: "#app",
    
    data() {
      return {
        msg: "Hello"
      }
    },
    // render: h => h(App)
    template: "<div>{{ msg }}</div>"
  })
})
