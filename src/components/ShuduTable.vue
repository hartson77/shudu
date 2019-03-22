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
import Blankcell from '../assets/js/blankCell'
import { getUndoCellAmount, getSpanTime } from '../assets/js/util'
import verifyMatrix from '../assets/js/verifymatrix'
export default {
  data () {
    return {
      tdList: null
    }
  },
  computed: {
    questionArray () {
      return this.question
    },
    ...mapState([
      'matrix',
      'inputIndex',
      'prevStack',
      'popData',
      'spanSecond',
      'gameoverState'
    ])
  },
  mounted () {
    this.tdList = document.querySelectorAll('td')
  },
  methods: {
    ...mapMutations([
      'setIndexMatrix',
      'pushPrevStack',
      'pauseTimer',
      'toggleState'
    ]),
    hasInvalidTd () {
      for (let node of this.tdList) {
        if (node.classList.contains('invalid')) {
          return true
        }
      }
      return false
    },
    showAlert(spanTime) {
      this.$createDialog({
        type: 'alert',
        title: '成功解题',
        content: '用时：' + spanTime,
        icon: 'cubeic-good'
        // onConfirm: () => {
        //   this.$parent.showMenu()
        // }
      }).show()
    },
    // 新游戏开始时，删除所有单元格的全部状态
    clearAllTdClass() {
      this.tdList.forEach((v, i) => {
        this.setTdClass(i, 'remove', 
          ['disabledTd', 'active-td', 'greenColor', 'invalid'])
      })
    },
    setTdClass (index, operation, classArr) {
      if (operation === 'add' || operation === 'remove') {
        if (classArr.length) {
          this.tdList[index]
            .classList[operation](...classArr)
        }
      }
    },
    // 标记原有题目单元格，也就是只读了
    tagQuestionTd (question) { 
      question.forEach((val, i) => {
        if (val !== 0) {
          this.tdList[i].classList.add('disabledTd')
        }
      })
    },
    tdClick (e) {
      //单元格填入数字处理
      let tmpStr = e.currentTarget
        .querySelector('span').innerHTML
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
        this.inputIndex === 9 ?
          num = 0 : num = this.inputIndex + 1 
        const len = this.prevStack.length
        if (len) {
          const prevInput = this.prevStack[len - 1]
          if (prevInput.index !== index || prevInput.num !== num) {
            this.fillTd(index, num, orignNum)
            this.pushPrevStack({index, orignNum, num})
          }
        } else {
          this.fillTd(index, num, orignNum)
          this.pushPrevStack({index, orignNum, num})
        }
        // 判断是否填完以及没有不正确填入，填完如果答案正确，出结果
        if (!this.hasInvalidTd() && getUndoCellAmount(this.matrix) === 0) {
          // 有上面那个hasValidTd判断, 不需要这个判断了，暂时放着
          if (verifyMatrix(this.matrix)) {
            this.pauseTimer()
            const timeStr = getSpanTime(this.spanSecond)
            this.toggleState()
            this.showAlert(timeStr)
          }
        }
      }
      // 处理所在行列变色,参考线
      this.rowAndColLine(index)
    },
    //单元格填入数字，并记录
    fillTd (index, num) {
      const td = this.tdList[index]
      if (!td.classList.contains('disabledTd')) {
        const i = Math.floor(index / 9)
        const j = index % 9
        const blankcell = new Blankcell(i, j, this.matrix)
        const invalidNumArr = blankcell.getImpossibleValue()
        td.classList.remove('greenColor', 'invalid')
        invalidNumArr.includes(num) ? 
          td.classList.add('invalid') :   //错误输入，变红色
          td.classList.add('greenColor')
        this.setIndexMatrix({ index, num })
      }
    },
    //生成行列参考线
    rowAndColLine (index) {
      const tdList = this.tdList
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
    // 输入按钮点击触发事件 各个单元内数字和按钮数字相同的变色
    inputBtnClick () {
      const inputNum = this.inputIndex + 1
      this.tdList.forEach((element, index) => {
        const i = Math.floor(index / 9)
        const j = index % 9
        const classList = element.classList
        classList.remove('active-td')
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
.disabledTd
  background-color rgba(254, 249, 231, 0.5)
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