<template>
  <div class="span-time">
    <i class="cubeic-time"></i>
    <span>{{getTimeString}}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getSpanTime } from '../assets/js/util'
export default {
  computed: mapState({
    getTimeString (state) {
      return getSpanTime(state.spanSecond)
    }
  })
}
</script>
<style lang="stylus" scoped>
.span-time
  padding-top 1.5vh
  font-size 3vh
  text-align center
  color #666
  span
    display inline-block
    padding-left 2vw
</style>