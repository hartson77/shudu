/**
 * 工具函数集
 * @module util
 */
/**
 * 生成矩阵，初始化每个元素都为0
 * @method initMatrix
 * @param {Number} n为矩阵的阶
 * @return {Array}
 */
const initMatrix = n => {
  return Array.from({ length: n }, () => {
    return Array.from({ length: n }, () => 0)
  })
}
/**
* 生成1-n的顺序字符串,用作标准比对，如n=9时， 字符串为‘123456789’
* @method testString
* @param {Number} n
* @return {String} 比对字符串
*/
const testString = n => {
  let res = ''
  for (let i = 1; i < n + 1; i++) {
    res += i
  }
  return res
}
/**
* 用Fish-Yates方法随机排序数组
* @method shuffle
* @param {Array} arr 输入的数组
* @return {Array} 随机排序后的数组
*/
const shuffle = arr => {
  const len = arr.length
  for (let i = len - 1; i > 0; i--) {
    const rand = Math.floor((Math.random() * (i + 1)))
    ;[arr[rand], arr[i]] = [arr[i], arr[rand]]
  }
  return arr
}
/**
* 数组深度拷贝,不考虑数组成员是对象的情况
* @method deepCopy
* @param {Array} arr
* @return {Array}
*/
const deepCopy = arr => {
  const res = []
  const recursion = (obj, parent) => {
    if (!Array.isArray(obj)) {
      parent.push(obj)
    } else {
      const tmp = []
      obj.forEach(v => {
        recursion(v, tmp)
      })
      parent.push(tmp)
    }
  }
  recursion(arr, res)
  const [output] = res
  return output
}
/**
* 获取给定单元格相关的数组
* @method relateArr
* @param {Number} i 矩阵二维数组的第一个索引
* @param {Number} j 矩阵二维数组的第二个索引
* @param {Array} i 矩阵二维数组本身
* @return {Object} rowArr:横数组; columnArr: 纵数组; blockArr: 宫数组
*/
const relateArr = (i, j, arr) => {
  const rowArr = arr[i]
  const columnArr = []
  const blockArr = []
  const startY = i - i % 3
  const startX = j - j % 3
  arr.forEach((v, a) => {
    v.forEach((u, b) => {
      if (j === b) columnArr.push(u)
      if (a >= startY && a < startY + 3 && b >= startX && b < startX + 3) {
        blockArr.push(u)
      }
    })
  })
  return {
    rowArr,
    columnArr,
    blockArr
  }
}
// 获取单元格所在宫数组的索引
function getBlockIndex (i, j) {
  return Math.floor(i / 3) * 3 + Math.floor(j / 3)
}

// 按数独的宫生成二维数组，第一宫为arr[0], 第二宫为arr[1] ---
function getBlockArray (arr) {
  const tmpArr = Array.from({ length: 9 }, () => [])
  arr.forEach((v, i) => {
    v.forEach((u, j) => {
      let k = getBlockIndex(i, j)
      tmpArr[k].push(u)
    })
  })
  return tmpArr
}
// 由宫数组索引，获取矩阵数组索引
function getMatrixIndex (i, j) {
  let x = Math.floor(i / 3) * 3 + Math.floor(j / 3)
  let y = i % 3 * 3 + j % 3
  return [x, y]
}

// 找到一组数组内相同的唯一元素
function searchSame (arr) {
  const first = arr.shift()
  for (let i = 0; i < first.length; i++) {
    if (arr.every(v => v.includes(first[i]))) {
      return first[i]
    }
  }
  return false
}

// 得到矩阵未填单元格数量
function getUndoCellAmount (matrix) {
  let count = 0
  matrix.forEach(v => {
    v.forEach(u => {
      if (u === 0) count++
    })
  })
  return count
}

// 排序，去重，如果所得数组中含有1-9数字中的8个，输出剩余那个（1-9）
function getRemainder (arr) {
  arr.sort()
  const tmpArr = [arr[0]]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== tmpArr[tmpArr.length - 1]) { tmpArr.push(arr[i]) }
  }
  if (tmpArr[0] === 0) tmpArr.shift()
  if (tmpArr.length !== 8) return false
  for (let i = 1; i < 10; i++) {
    if (!tmpArr.includes(i)) return i
  }
}

function getSpanTime (spanSecond) {
  let hou = Math.floor(spanSecond / 3600)
  hou = hou.toString().padStart(2, 0)
  let min =  Math.floor(spanSecond / 60 % 60) 
  min = min.toString().padStart(2, 0)
  let sec = Math.floor(spanSecond % 60)
  sec = sec.toString().padStart(2, 0)
  return hou + ':' + min + ':' + sec
}

export {
  shuffle, testString, initMatrix,
  deepCopy, getRemainder,relateArr,
  searchSame, getBlockIndex, getMatrixIndex,
  getBlockArray, getUndoCellAmount, getSpanTime
}
