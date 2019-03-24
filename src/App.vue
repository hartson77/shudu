<template>
  <div id="app">
    <Menu
      v-show="menuIsShow"
      @menuSelect="menuSelect"
    />
    <ShuduTable
      ref="table"
    />
    <InputZone />
    <Toolbar @showMenu="showMenu" />
    <SpanTime />
    <cube-popup
      type="pause-popup"
      :content="popTip"
      :mask-closable="false"
      @mask-click="resumeGame"
      ref="pausePopup" />
  </div>
</template>

<script>
import Menu from './components/Menu'
import ShuduTable from './components/ShuduTable'
import InputZone from './components/InputZone'
import Toolbar from './components/Toolbar'
import SpanTime from './components/SpanTime'

import fetchData from './api/data.json'
import Matrix from './assets/js/matrix'
import { deepCopy, getSpanTime } from './assets/js/util'

import { mapMutations, mapState } from 'vuex'
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
      questionArray: [],
      // 手机横屏 为true
      ocState: false,
      endGameState: false,
      popTip: '<i>暂停<i>',
      gameLevel: '',
      customAnswer: null
    }
  },
  computed: {
    ...mapState([
      'gameoverState',
      'matrix',
      'spanSecond'
    ])
  },
  mounted () {
    // 横屏处理 不支持横屏
    this.ocHandle()
    window.addEventListener(
      "onorientationchange" in window 
      ? 'orientationchange' : 'resize',
      this.ocHandle
    )
  },
  methods: {
    // 横屏 暂停
    ocHandle () {
      if (window.orientation === 90
        || window.orientation === -90) {
        this.ocState = true
        this.pauseGame()
        this.popTip ="<i>不支持横屏<i>"
      } else {
        this.ocState = false
        this.resumeGame()
        this.popTip ="<i>暂停<i>"
      }
    },
    // 显示toast 提示信息 工具函数
    showToast (type, txt) {
      const toast = this.$createToast({
        txt,
        type,
      })
      toast.show()
    },
    // 显示完成谜题信息
    showAlert(spanTime) {
      this.$createDialog({
        type: 'alert',
        title: '成功解题',
        content: '用时：' + spanTime,
        icon: 'cubeic-good'
      }).show()
    },
    // 显示主菜单 
    showMenu () {
      this.resetTimer()
      this.endGameState = false
      this.questionArray = null
      this.menuIsShow = true
    },
    menuSelect (level) {
      this.menuIsShow = false
      this.gameLevel = level
      if (level !== 'custom') {
        this.startGame(level)
      } else if(level === 'custom') {
        // 开始自定义迷局出题
        // eslint-disable-next-line
        this.customQuestion()
      }
    },
    customQuestion () {
      if (this.gameoverState) {
        this.toggleState()
      }
      this.resetTimer()
      const tmpArr = Array.from({length: 81}, () => 0)
      // 清空所有单元格
      this.$refs.table.clearAllTdClass()
      this.initMatrix(tmpArr)
      // 清空自定义谜题答案，有可能是上一次的
      this.customAnswer = null
    },
    pauseGame () {
      if (!this.gameoverState) {
        const popup = this.$refs.pausePopup
        popup.show()
        this.pauseTimer()
      }
    },
    resumeGame () {
      if (!this.ocState) {
        this.$refs.pausePopup.hide()
        if (this.questionArray)
          this.startTimer()
      }
    },
    endGame (type) {
      if (!this.gameoverState) {
        this.toggleState()
      }
      const timeStr = getSpanTime(this.spanSecond)
      this.pauseTimer()
      this.endGameState = true
      if (type !== 'cheat')
        this.showAlert(timeStr)

    },
    customStart () {
      if (this.gameLevel === 'custom' && !this.endGameState) {
        this.customAnswer = null
        // 判断自定义谜题合法性
        if (this.$refs.table.hasInvalidTd()) {
          this.showToast('error', '自定义谜题有误')
        }
        try {
          const tmpMatrix = deepCopy(this.matrix)
          const matrix = new Matrix(tmpMatrix) 
          this.customAnswer = matrix.solvePuzzle()
        } catch (e) {
          this.showToast('error', e)
        }
        if (this.customAnswer) {
          this.startGame()
        }
      }
    },
    startGame (type) {
      if (this.gameoverState) {
        this.toggleState()
      }
      this.endGameState = false
      if (type !== 'reset') {
        this.getQuestion(this.gameLevel)
      } 
      // 自定义时，没有完成出题，选“重新开始”时，跳回开始出题状态
      if (this.gameLevel === 'custom' && !this.questionArray) {
        this.customQuestion()
      } else {
        this.$refs.table.clearAllTdClass()
        // 标记题目单元格
        this.$refs.table.tagQuestionTd(this.questionArray)
        this.initMatrix(this.questionArray)
        this.resetTimer()
        this.startTimer()
      }
    },
    getQuestion (level) {
      if (level !== 'custom') {
        let questionArr
        fetchData.forEach(v => {
          if (v.level === level) {
            questionArr = v.question
          }
        })
        const len = questionArr.length
        const index = Math.floor(Math.random() * len)
        this.questionArray =
          [...questionArr[index]].map(v => parseInt(v))
      } else if (level === 'custom') {
        const flat = arr => [].concat(...arr)
        // this.questionArray = this.matrix.flat()
        this.questionArray = flat(this.matrix)
      }
    },
    initMatrix (array) {
       // eslint-disable-next-line
      // console.log(this.questionArray)
      for (let i = 0; i < 81; i++) {
        this.setIndexMatrix({index: i, num: array[i]})
      }
    },
    getAnswer () {
      let answerArr
      const flat = arr => [].concat(...arr)
      if (this.gameLevel !== 'custom') {
        const tmpMatrix = Array.from({length: 9}, () => [])
        let index = 0
        for (let i = 0; i < 9; i++) {
          for (let j = 0; j < 9; j++) {
            tmpMatrix[i][j] = this.questionArray[index++]
          }
        }
        const matrix = new Matrix(tmpMatrix)
        const resultArray = matrix.solvePuzzle()
        // answerArr = resultArray.flat()
        answerArr = flat(resultArray)
      } else if (this.gameLevel === 'custom') {
        if (this.customAnswer) {
          // answerArr = this.customAnswer.flat()
          answerArr = flat(this.customAnswer)
        } else {
          return
        }
      }
      for (let i = 0; i < 81; i++) {
        this.setIndexMatrix({index: i, num: answerArr[i]})
      }
      this.endGame('cheat')
    },
    ...mapMutations([
      'resetTimer',
      'startTimer',
      'pauseTimer',
      'setIndexMatrix',
      'toggleState'
    ])
  }
}
</script>

<style lang="stylus">
.greenColor
  color green
.invalid
  color red
#app
  .menu
    z-index 100
  .cube-pause-popup
    i
      color #fff
      font-size 18vw
</style>
