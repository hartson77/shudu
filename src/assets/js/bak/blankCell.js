import { relateArr, getBlockIndex } from './util'
class Blankcell {
  constructor (i, j, array) {
    const { rowArr, columnArr, blockArr } = relateArr(i, j, array)
    this.rowArr = rowArr
    this.columnArr = columnArr
    this.blockArr = blockArr
    this.blockIndex = getBlockIndex(i, j)
    this.impossibleValue = this.getImpossibleValue()
    this.possibleValue = this.getPossibleValue()
  }
  getPossibleValue () {
    const resArr = []
    const tmpArr = this.rowArr.concat(this.columnArr, this.blockArr)
    for (let i = 1; i < 10; i++) {
      if (!tmpArr.includes(i)) {
        resArr.push(i)
      }
    }
    return resArr
  }
  getImpossibleValue () {
    const resArr = []
    const tmpArr = this.rowArr.concat(this.columnArr, this.blockArr)
    for (let i = 1; i < 10; i++) {
      if (tmpArr.includes(i)) {
        resArr.push(i)
      }
    }
    return resArr
  }
}
export default Blankcell
