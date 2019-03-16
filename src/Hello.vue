<template>
  <div @click="clickHandler">
    {{content}}
    <slot name="other"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'hello',
    props: {
      content: {
        type: String,
        default: 'Hello'
      }
    },
    methods: {
      clickHandler(e) {
        this.$emit('click', e)
      }
    }
  }
</script>