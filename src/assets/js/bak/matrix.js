import BlankCell from './blankCell'
import { searchSame, getRemainder, deepCopy, getUndoCellAmount } from './util'
import verifyMatrix from './verifymatrix'
class Matrix {
  constructor (arr) {
    if (81 - getUndoCellAmount(arr) < 17) { throw new Error('提示数不能小于17个') }
    this.array = arr
    this.blankCellList = this.searchBlankCell()
    // 矩阵是否更新过标志,即是否有空格填入值
    this.updateFlag = false
  }
  /**
  * 扫描矩阵，获得空格对象（BlankCell）数组
  * @method searchBlankCell
  * @return {Array} 获取blankCellList属性
  */
  searchBlankCell () {
    const res = []
    this.array.forEach((v, i) => {
      v.forEach((u, j) => {
        if (u === 0) {
          const cell = new BlankCell(i, j, this.array)
          res.push(cell)
        }
      })
    })
    return res
  }
  /**
  * 填入空格，并更新空格对象数组blackCellList，以及属性updatFlag标志
  * @method fillUndoCell
  * @param {Array} 数组成员为对象，有index(在矩阵中的索引数组[i, j]),value(要填入的值)两个属性
  */
  fillUndoCell (inArr) {
    if (inArr.length) {
      inArr.forEach(v => {
        const [y, x] = v.index
        this.array[y][x] = v.value
      })
      // 更新属性：空表格对象列表
      this.blankCellList = this.searchBlankCell()
      this.updateFlag = true
    } else {
      this.updateFlag = false
    }
  }
  /**
  * 如果空格可填候选值只有一个，直接将该值填入(唯一法)
  * @method unique
  */
  unique () {
    const tmpArr = []
    for (let i = 0; i < this.blankCellList.length; i++) {
      const possible = this.blankCellList[i].possibleValue
      if (possible.length === 1) {
        const tmpObj = {}
        tmpObj.index = this.blankCellList[i].index
        tmpObj.value = possible[0]
        tmpArr.push(tmpObj)
      }
    }
    this.fillUndoCell(tmpArr)
  }
  /**
  * 如果空格候选中有所在行，列或者宫中所有空格的都有的不可能存在值，那么该候选值即为该空格应该填的值
  * @method exclude
  */
  exclude () {
    const res = []
    for (let i = 0; i < this.blankCellList.length; i++) {
      const possible = this.blankCellList[i].possibleValue
      const rowArr = [possible]
      const columnArr = [possible]
      const blockArr = [possible]
      const [y, x] = this.blankCellList[i].index
      const blockIndex = this.blankCellList[i].blockIndex
      for (let j = 0; j < this.blankCellList.length; j++) {
        if (j !== i) {
          const [a, b] = this.blankCellList[j].index
          const bi = this.blankCellList[j].blockIndex
          if (a === y) rowArr.push(this.blankCellList[j].impossibleValue)
          if (b === x) columnArr.push(this.blankCellList[j].impossibleValue)
          if (bi === blockIndex) blockArr.push(this.blankCellList[j].impossibleValue)
        }
      }
      let onlyValue = searchSame(rowArr) || searchSame(columnArr) || searchSame(blockArr)
      if (onlyValue) {
        res.push({
          index: this.blankCellList[i].index,
          value: onlyValue
        })
      }
    }
    // 去重
    for (let i = 0; i < res.length; i++) {
      if (!res.mutiFlag) {
        for (let j = i + 1; j < res.length; j++) {
          if (i !== j && res[i].index === res[j].index && res[i].value === res[j].value) {
            res[j].mutiFlag = true
          }
        }
      }
    }
    const tmp = res.filter(v => !v.mutiFlag)
    this.fillUndoCell(tmp)
  }
  /**
  * 空格所在的行列宫已填中有1-9中的8个数字，那么剩下的那个数字即为该空格应填入的数字
  * @method remind
  */
  remaind () {
    const tmpArr = []
    for (let i = 0; i < this.blankCellList.length; i++) {
      const bcell = this.blankCellList[i]
      const tmpArr = bcell.rowArr.concat(bcell.columnArr, bcell.blockArr)
      const fillNum = getRemainder(tmpArr)
      if (fillNum) {
        tmpArr.push({
          index: bcell.index,
          value: fillNum
        })
      }
    }
    this.fillUndoCell(tmpArr)
  }
  /**
  * 对未填空格进行扫描，优先使用复杂度低的方法（unique > exclude > remaind）
  * @method solveMethods
  */
  solveMethods () {
    this.updateFlag = true
    while (this.updateFlag && this.blankCellList.length > 0) {
      this.unique()
      if (this.updateFlag) continue
      this.exclude()
      if (this.updateFlag) continue
      this.remaind()
    }
  }

  // 找到可填入候选值数量最少的空格(第一个)
  /**
  * 在未填空格中找到可填候选值最少的那个单元格
  * @method findMinPossibleCell
  * @return {BlankCell} 返回自定义空格对象
  */
  findMinPossibleCell () {
    let j = 0
    let min = 9
    this.blankCellList.forEach((v, i) => {
      if (v.possibleValue.length < min) {
        min = v.possibleValue.length
        j = i
      }
    })
    return this.blankCellList[j]
  }
  /**
  * 检查findMinPossibleCell方法返回的空格对象可填候选值是否存在
  * @method check
  * @return {Boolean} 返回false，说明之前的尝试解法错误
  */
  check () {
    const len = this.findMinPossibleCell().possibleValue.length
    if (len === 0) {
      return false
    }
    return true
  }
  /**
  * 最终的解法，在方法solveMethods无法继续解的情况下，找到可填候选值最少的空格，用它的候选值
  * 依次尝试，采用递归调用，如果成功，对象的array属性即为最终的解法 todo~~~
  * @method solvePuzzle
  * @return {Array} 返回答案数组
  */
  solvePuzzle () {
    const resArr = []
    const solve = () => {
      this.solveMethods()
      if (this.blankCellList.length > 0) {
        if (!this.check()) return
        const cell = this.findMinPossibleCell()
        const tmpMatrix = deepCopy(this.array)
        for (let i = 0; i < cell.possibleValue.length; i++) {
          if (i !== 0) {
            this.array = deepCopy(tmpMatrix)
            this.blankCellList = this.searchBlankCell()
          }
          this.fillUndoCell([{
            index: cell.index,
            value: cell.possibleValue[i]
          }])
          solve()
        }
      } else {
        if (verifyMatrix(this.array)) {
          const tmp = deepCopy(this.array)
          resArr.push(tmp)
        }
      }
    }
    solve()
    if (resArr.length === 0) {
      throw new Error('该数独题无解，或者俺还不会解')
    } else if (resArr.length === 1) {
      return resArr[0]
    } else {
      throw new Error('该数独题有多个解，不符合唯一解的要求')
    }
  }
}

export default Matrix
