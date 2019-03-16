<template>
  <div class="menu">
    <h1>数独</h1>
    <div class="menu-btn-group">
      <cube-button
        class="menu-btn"
        @click="btnClick"
        id="easy"
      >简单</cube-button>
      <cube-button
        class="menu-btn"
        @click="btnClick"
        id="medium"
      >中等</cube-button>
      <cube-button
        class="menu-btn"
        @click="btnClick"
        id="hard"
      >困难</cube-button>
      <cube-button
        class="menu-btn"
        @click="btnClick"
        id="custom"
      >生成自己的谜题</cube-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    btnClick (e) {
      this.$emit('menuSelect',e.target.id)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .menu
    position absolute
    left 0
    top 0
    right 0
    bottom 0
    background #ccc
    padding 5%
    h1
      font-size 8vh
      height 10vh
      line-height 10vh
    .menu-btn-group
      .menu-btn
        margin 3vh 0
</style>