<template>
  <div class="table">
    <table>
      <tr v-for="(arr, i) in matrix" :key="i">
        <td
          v-for="(val, j) in arr"
          :key="j"
          @click="tdClick"
        >
          <span
          >{{val===0 ? '':val}}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  data () {
    return {
      tdList: null
    }
  },
  computed: {
    ...mapState([
      'matrix',
      'inputIndex',
      'prevStack'
    ])
  },
  mounted () {
    this.tdList = document.querySelectorAll('td')
  },
  methods: {
    ...mapMutations([
      'setIndexMatrix',
      'pushPrevStack'
    ]),
    tdClick (e) {
      //填入数组处理
      let tmpStr = e.currentTarget.querySelector('span').innerHTML
      tmpStr = tmpStr ? tmpStr : 0
      const orignNum = Number.parseInt(tmpStr)
      const tdList = this.tdList
      let index
      tdList.forEach((v, i) => {
        if (e.currentTarget === v) {
          index = i
        }
      })
      let num
      if (this.inputIndex !== -1) {
        if (this.inputIndex === 9) {
          num = 0
        } else {
          num = this.inputIndex + 1
        }
        const len = this.prevStack.length
        if (len) {
          const prevInput = this.prevStack[len - 1]
          if (prevInput.index !== index || prevInput.num !== num) {
            this.setIndexMatrix({ index, num })
            tdList[index].classList.add('greenColor')
            this.pushPrevStack({index, orignNum, num})
          }
        } else {
          this.setIndexMatrix({ index, num })
          tdList[index].classList.add('greenColor')
          this.pushPrevStack({index, orignNum, num})
        }
      }
      // 处理所在行列变色
      const row = Math.floor(index / 9)
      const col = index % 9
      for (let i = 0; i < tdList.length; i++) {
        tdList[i].classList.remove('active-td')
        const x = Math.floor(i / 9)
        const y = i % 9
        if (x === row || y === col) {
          tdList[i].classList.add('active-td')
        }
      }
    },
    inputBtnClick () {
      const inputNum = this.inputIndex + 1
      this.tdList.forEach((element, index) => {
        const i = Math.floor(index / 9)
        const j = index % 9
        const classList = element.classList
        if (classList.contains('greenColor')) {
          classList.remove('greenColor')
        }
        if (this.matrix[i][j] === inputNum) {
          classList.add('greenColor')
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
$border-color = #666
.active-td 
  background-color #eee
.table
  box-sizing border-box
  width 100%
  padding 1vw
  color #666
  table
    width 100%
    border 3px solid $border-color
    tr
      td
        border 1px solid $border-color
        width (100%/9)
        position relative
        overflow hidden
        &:after
          content ''
          display block
          margin-top 100%
        span
          position absolute
          width 100%
          text-align center
          top 0
          font-size 5vw
          line-height 10vw
        &:nth-child(3),
        &:nth-child(6)
          border-right: 3px solid $border-color
      &:nth-child(3),
      &:nth-child(6)
        td
          border-bottom: 3px solid $border-color
</style>