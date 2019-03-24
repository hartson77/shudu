<template>
  <div>
    <cube-toolbar
      :actions="actions"
      @click="clickHandler"
      :more-actions="moreActions"
    ></cube-toolbar> 
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      spanTime: '',
      actions: [
        {
          text: '暂停',
          action: 'pauseGame',
        },
        {
          text: '重新开始',
          action: 'resetGame'
        },
        {
          text: '新游戏',
          action: 'renewGame'
        }
      ],
      moreActions: [
        {
          text: '看答案',
          action: 'getAnswer'
        },
        {
          text: '自定义开始',
          action: 'customStart'
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'gameoverState'
    ])
  },
  methods: {
    ...mapMutations([
      'resetTimer',
      'pauseTimer',
      'startTimer'
    ]),
    pauseGame () {
      this.$parent.pauseGame()
    },
    resetGame () {
      this.$parent.startGame('reset') //todo debug
    },
    renewGame () {
      this.$emit('showMenu')
    },
    getAnswer () {
      this.$parent.getAnswer()
    },
    customStart () {
      this.$parent.customStart()
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