function getRemainder (arr) {
  const tmpArr = [arr[0]]
  arr.sort()
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== tmpArr[tmpArr.length - 1]) { tmpArr.push(arr[i]) }
  }
  if (tmpArr[0] === 0) tmpArr.shift()
  if (tmpArr.length !== 8) return false
  for (let i = 1; i < 10; i++) {
    if (!tmpArr.includes(i)) return i
  }
}
const arr = [1, 2, 2, 6, 6, 7, 8, 7, 3, 9, 5, 5, 7]
console.log(getRemainder(arr))

// todo list
// 1. 移动端的输入面板的拖动还需要适配