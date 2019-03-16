<template>
  <div>
    <cube-toolbar
    :actions="actions"
    @click="clickHandler"></cube-toolbar> 
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      spanTime: '123:23',
      actions: [
        {
          text: '暂停',
          action: 'pauseGame'
        },
        {
          text: '重新开始',
          action: 'resetGame'
        },
        {
          text: '新游戏',
          action: 'renewGame'
        }
      ]
    }
  },
  methods: {
    ...mapMutations([
      'resetTimer',
      'pauseTimer',
      'startTimer'
    ]),
    pauseGame () {
      //debug
      // if (this.actions[0].text === '暂停') {
      //   this.pauseTimer()
      //   this.actions[0].text = '恢复'
      // } else if (this.actions[0].text === '恢复') {
      //   this.startTimer()
      //   this.actions[0].text = '暂停'
      // }
      const popup = this.$parent.$refs.pausePopup
      popup.show()
      this.pauseTimer()
    },
    resetGame () {
      // todo 清除所有用户填入数字
      this.resetTimer()
      this.startTimer()
    },
    renewGame () {
      this.resetTimer()
      this.$emit('showMenu')
    },
    clickHandler(item) {
      if (item.action) {
        this[item.action](item)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>