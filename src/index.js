import Vue from "vue"
import Hello from "./Hello.vue"

document.addEventListener("DOMContentLoaded", () => {
  new Vue({
    el: "#app",
    
    render: h => h(Hello)
  })
})
