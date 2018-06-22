<template>
  <div>
    <div>{{ msg }}</div>
    <div>{{ post.title }}</div>
  </div>
</template>

<script>
export default {
  name: "Hello",

  asyncData(store) {
    return store.dispatch("fetchPost")
  },

  mounted() {
    this.$store.dispatch("fetchPost")
  },

  data() {
    return {
      msg: "Hello"
    }
  },

  computed: {
    post() {
      return this.$store.state.post
    }
  }
}
</script>
