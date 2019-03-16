<template>
  <div id="app">
    <Menu
      v-show="menuIsShow"
      @menuSelect="menuSelect"
    />
    <ShuduTable ref="table" />
    <InputZone />
    <Toolbar @showMenu="showMenu" />
    <SpanTime />
    <cube-popup
      type="pause-popup"
      content="<i>暂停</i>"
      :mask-closable="true"
      @mask-click="hideAndStart"
      ref="pausePopup" />
  </div>
</template>

<script>
import Menu from './components/Menu'
import ShuduTable from './components/ShuduTable'
import InputZone from './components/InputZone'
import Toolbar from './components/Toolbar'
import SpanTime from './components/SpanTime'

import { mapMutations } from 'vuex'
export default {
  name: 'app',
  components: {
    Menu,
    ShuduTable,
    InputZone,
    Toolbar,
    SpanTime
  },
  data () {
    return {
      menuIsShow: true,
    }
  },
  methods: {
    showMenu () {
      this.menuIsShow = true
    },
    menuSelect (id) {
      this.menuIsShow = false
      this.startTimer()
       // eslint-disable-next-line
      console.log(this.shuduArray)
       // eslint-disable-next-line
      console.log(id)
    },
    hideAndStart () {
      this.$refs.pausePopup.hide()
      this.startTimer()
    },
    ...mapMutations([
      'startTimer'
    ])
  }
}
</script>

<style lang="stylus">
.greenColor
  color green
#app
  .menu
    z-index 100
  .cube-pause-popup
    i
      color #fff
      font-size 20vw
      font-weight bold 
</style>
