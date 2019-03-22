import Vue from 'vue'
import Vuex from 'vuex'
import { initMatrix } from '../assets/js/util'

Vue.use(Vuex)
const state = {
  // 用时秒
  spanSecond: 0,
  // 计时用的时钟ID
  timer: null,
  // 矩阵二维数组
  gameoverState: false,
  matrix: initMatrix(9), 
  // 面板输入的数字索引 0-8 -> 1-9, 9->删除
  inputIndex: -1,
  // 后退栈 Array  {index:Number, originNum: Number, num: Number}
  prevStack: [],
  // 前进栈
  nextStack: [],
  // 弹出栈的值 {index:Number, originNum: Number, num: Number}
  popData: {}
}
const mutations = {
  resetTimer (state) {
    clearInterval(state.timer)
    state.spanSecond = 0,
    state.timer = null
  },
  pauseTimer (state) {
    clearInterval(state.timer)
  },
  startTimer (state) {
    state.timer = setInterval(() => {
      state.spanSecond++
    }, 1000);
  },
  setInputIndex (state, index) {
    state.inputIndex = index
  },
  setIndexMatrix (state, payload) {
    // 一维索引转二维索引

    const index = payload.index
    const i = Math.floor(index / 9)
    const j = index % 9

    state.matrix[i].splice(j, 1, payload.num)
  },
  pushPrevStack (state, payload) {
    state.prevStack.push(payload)
  },
  popPrevStack (state) {
    state.popData = state.prevStack.pop()
  },
  pushNextStack (state, payload) {
    state.nextStack.push(payload)
  },
  popNextStack (state) {
    state.popData = state.nextStack.pop()
  },
  toggleState (state) {
    state.gameoverState = !state.gameoverState
  }
}

export default new Vuex.Store({
  state,
  mutations
})