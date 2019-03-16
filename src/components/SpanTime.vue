<template>
  <div class="span-time">
    <i class="cubeic-time"></i>
    <span>{{getSpanTime}}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    getSpanTime (state) {
      let hou = Math.floor(state.spanSecond / 3600)
      hou = hou.toString().padStart(2, 0)
      let min =  Math.floor(state.spanSecond / 60 % 60) 
      min = min.toString().padStart(2, 0)
      let sec = Math.floor(state.spanSecond % 60)
      sec = sec.toString().padStart(2, 0)
      return hou + ':' + min + ':' + sec
    }
  })
}
</script>
<style lang="stylus" scoped>
.span-time
  font-size 4vh
  text-align center
  color #666
  span
    display inline-block
    padding-left 2vw
</style>