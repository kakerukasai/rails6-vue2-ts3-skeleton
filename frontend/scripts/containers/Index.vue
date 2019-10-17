<template lang="pug">
#app
  .wrapper.columns.is-centered
    .column.is-half
      article.message.is-primary.is-centered
        .message-header
          font-awesome-icon(icon="coffee")
          | Hello, world
        .message-body.has-text-centered
          p Welcome to Rails+Vue+TypeScript Skeleton!
          div
            img(:src="cat")
          span.icon
            i.fas.fa-home
          button.button.is-primary
            | Button
</template>

<script lang="ts">
import cat from 'images/common/cat.jpg'

export default {
  name: 'Index',
  computed: {
    cat: () => cat,
  },
}
</script>

<style lang="sass" scoped>
@import 'styles/main/vue'
#app
  height: 100vh
  .wrapper
    display: flex
    align-items: center
    height: 100%
</style>
