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
            SvgSample.svg-sample
          div
            img(:src="cat")
          span.icon
            i.fas.fa-home
          button.button.is-primary
            | Button
</template>

<script lang="ts">
import cat from 'images/common/cat.jpg'
import SvgSample from 'images/common/img-svg-sample.svg?inline'

export default {
  name: 'Index',
  computed: {
    cat: () => cat,
  },
  components: {
    SvgSample,
  },
}
</script>

<style lang="sass" scoped>
@import 'styles/main/vue'
#app
  background: url('../../images/common/bg-confetti.svg')
  background-size: cover
  height: 100vh
  .svg-sample
    margin-top: 20px
    color: #2364c0
  .wrapper
    display: flex
    align-items: center
    height: 100%
</style>
