import { testString, deepCopy } from './util'

// 数独是9阶的
const order = 9

// 定义标准比较字符串和基本校验方法
const basicMethod = arr => {
  const standardString = testString(order)
  const arrCopy = deepCopy(arr)
  for (let i = 0; i < order; i++) {
    if (arrCopy[i].sort().join('') !== standardString) {
      return false
    }
  }
  return true
}

// 矩阵转置
const rotateMatrix = arr => {
  const tmpArr = Array.from({ length: 9 }, () => [])
  arr.forEach(v => {
    v.forEach((u, j) => {
      tmpArr[j].push(u)
    })
  })
  return tmpArr
}

// 按数独的宫生成二维数组，第一宫为arr[0], 第二宫为arr[1] ---
const blockMatrix = arr => {
  const tmpArr = Array.from({ length: 9 }, () => [])
  arr.forEach((v, i) => {
    v.forEach((u, j) => {
      let k = Math.floor(i / 3) * 3 + Math.floor(j / 3)
      tmpArr[k].push(u)
    })
  })
  return tmpArr
}

// 检验最终的矩阵是否是数独
function verifyMatrix (arr) {
  if (arr.length !== order) return false
  arr.forEach(v => {
    if (v.length !== order) return false
  })

  if (!basicMethod(arr)) return false

  const rMatrix = rotateMatrix(arr)
  if (!basicMethod(rMatrix)) return false

  const bMatrix = blockMatrix(arr)
  if (!basicMethod(bMatrix)) return false

  return true
}

export default verifyMatrix
