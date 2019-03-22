<template>
  <div class="input-zone">
    <div class="left">
      <cube-button
        class="pn-button"
        :outline="true"
        :inline="true"
        :disabled="isDisabledPrevButton||gameoverState"
        @click="pnClick"
      >
        <i class="cubeic-back"></i>
      </cube-button>
    </div>
    <div class="center">
      <cube-button
        class="input-button"
        :inline="true"
        :outline="true"
        v-for="(item,index) in btnData"
        :key="index"
        :active="item.isActive"
        :disabled="gameoverState"
        @click="inputBtnClick"
      >
        {{item.text}}
      </cube-button>
    </div>
    <div class="right">
      <cube-button
        :outline="true"
        :inline="true"
        :disabled ="isDisabledNextButton||gameoverState"
        class="pn-button"
        @click="nextClick"
      >
        <i class="cubeic-arrow"></i>
      </cube-button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      btnData: Array.from({length: 10}, (v, i) => ({
        isActive: false,
        text: i ===9 ? '删' : i + 1
      })),
      activeIndex: -1,
    }
  },
  computed: {
    ...mapState([
      'prevStack',
      'nextStack',
      'popData',
      'gameoverState'
    ]),
    isDisabledPrevButton () {
      return this.prevStack.length ? false : true || false
    },
    isDisabledNextButton () {
      return this.nextStack.length ? false : true || false
    },
  },
  methods: {
    ...mapMutations([
      'pushPrevStack',
      'popPrevStack',
      'pushNextStack',
      'popNextStack',
      'setIndexMatrix'
    ]),
    inputBtnClick (e) {
      const list = document.querySelectorAll('.input-button')
      let index
      list.forEach((v, i) => {
        if (v === e.target) {
          index = i
        }
      })
      if (this.activeIndex !== -1) {
        this.btnData[this.activeIndex].isActive = false
        if (this.activeIndex === index) {
          index = -1
        } else {
          this.btnData[index].isActive = true
        }
      } else {
          this.btnData[index].isActive = true
      }
      this.activeIndex = index
      this.$store.commit('setInputIndex', index)
      if (index > -1 && index < 9) {
        this.$parent.$refs.table.inputBtnClick()
      }
    }, 
    pnClick () {
      this.popPrevStack()
      const {index, orignNum} = this.popData
      const num = orignNum
      this.pushNextStack(this.popData)
      this.$parent.$refs.table.fillTd(index, num)
    },
    nextClick () {
      this.popNextStack()
      const {index, num} = this.popData
      this.pushPrevStack(this.popData)
      this.$parent.$refs.table.fillTd(index, num)
    }
  }
}
</script>
<style lang="stylus" scoped>
.input-zone
  display flex
  padding 1vh 5vh
  .center
    display flex
    height 12vh
    width 80%
    flex-wrap wrap
    justify-content center
    align-content stretch
    .input-button
      width 10vw
      height 10vw
      font-size 4vw
      margin 0 1vw
  .left, .right
    flex: 1
    height 12vh
    display flex
    justify-content center
    align-items center
</style>