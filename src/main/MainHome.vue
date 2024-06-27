<template>
  <div class="main-box flexMainYXcenter">
     <div class="header">
      <div class="flexMainXYcenter">
        <div class="score-box flexMainYXcenter">
          <span>分数{{ isEnd ? '结束' : '' }}</span>
          <span style="margin-top: 6px;">{{ totalGoal }}</span>
        </div>
        <!-- <div> 
          <div @click="baseHandle(1)">上</div>
          <div @click="baseHandle(2)">下</div>
          <div @click="baseHandle(3)">左</div>
          <div @click="baseHandle(4)">右</div>
        </div> -->
      </div>
      <div class="score-box begin" @click="init">开始</div>
     </div>
     <div class="section">
      <tr v-for="(rowItem, rowIndex) in cellList" :key="rowIndex" class="cell-box flexMainXYcenter">
        <td v-for="cellItem in rowItem" :key="cellItem.id" class="cell flexMainXcenter" :style="`color: ${getNumColor(cellItem.value)}; background: ${getBgColor(cellItem.value)}; font-size: ${getFontSize(cellItem.value)}px`">
          {{ cellItem.value === 0 ? '' : cellItem.value }}
        </td>
      </tr>
     </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getNumColor, getBgColor, getFontSize, throttle } from '@/assets/enum'

const cellList = ref([
  [ { id: '0-0', value: 0 }, { id: '0-1', value: 0 }, { id: '0-2', value: 0 }, { id: '0-3', value: 0 } ],
  [ { id: '1-0', value: 0 }, { id: '1-1', value: 0 }, { id: '1-2', value: 0 }, { id: '1-3', value: 0 } ],
  [ { id: '2-0', value: 0 }, { id: '2-1', value: 0 }, { id: '2-2', value: 0 }, { id: '2-3', value: 0 } ],
  [ { id: '3-0', value: 0 }, { id: '3-1', value: 0 }, { id: '3-2', value: 0 }, { id: '3-3', value: 0 } ],
])

const isEnd = ref(false)

const totalGoal = ref(0)

const init = () => {
  isEnd.value = false
  totalGoal.value = 0
  cellList.value.forEach((item) => {
    item.forEach((_item) => {
      _item.value = 0
    })
  })
  generateCell(2, 2)
}

//随机生产方块
const generateCell = (_num, _value) => {
  let num = _num || Math.floor(Math.random() * 2) + 1 //随机生成1个或2个方块
  // const canList = ['0-0', '1-0'] //可以生成的格子列表(value为0)
  const canList = [] //可以生成的格子列表(value为0)
  cellList.value.forEach((item) => {
    item.forEach((_item) => {
      if(_item.value === 0) {
        canList.push(_item.id)
      }
    })
  })
  let canListLen = canList.length

  if(canListLen === 0) {
    console.log('走不动了！！！！！');
    let newCellList = upHandle()
    if(!isChangeCell(newCellList, cellList.value)) {
      isEnd.value = true
      return
    }
    newCellList = downHandle()
    if(!isChangeCell(newCellList, cellList.value)) {
      isEnd.value = true
      return
    }
    newCellList = leftHandle()
    if(!isChangeCell(newCellList, cellList.value)) {
      isEnd.value = true
      return
    }
    newCellList = rightHandle()
    if(!isChangeCell(newCellList, cellList.value)) {
      isEnd.value = true
      return
    }
    return
  } else if(canListLen <= 6) { //空位置<=6时只生产一个方块
    num = 1
  }
  let n = num
  const newCellList = []
  while(n--) {
    const cellData = {
      id: null,
      value: _value || (num === 1 && Math.floor(Math.random() * 10) > 8 ? 4 : 2) //生成2的概率80，4的概率20
    }
    let newCell = canList[Math.floor(Math.random() * canListLen)]
    while(newCellList.find(item => item.id == newCell)) {
      newCell = canList[Math.floor(Math.random() * canListLen)] //防止生成在同一格子
    }
    console.log('vvvv', newCell);
    cellData.id = newCell
    newCellList.push(cellData)
    if(canListLen === 1) break
  }
  newCellList.forEach((c) => {
    cellList.value.forEach((item) => {
      item.forEach((_item) => {
        if(c.id == _item.id) {
          _item.value = c.value
        }
      })
    })
  })
  console.log('新值', ...newCellList);
  cellList.value.forEach((i, index) => {
    let s = ''
    i.forEach((item) => {
      s += item.value + ','
    })
    console.log('第'+ index +'行', ...s);
  })
}

//滑动后是否有值改变，不改变则不生成新方块
const isChangeCell = (newList, oldList) => {
  for (let i = 0; i < oldList.length; i++) {
    for (let j = 0; j < oldList[i].length; j++) {
      if(oldList[i][j].value !== newList[i][j].value) {
        console.log('改变了');
        return true
      }
    }  
  }
  return false
}

const baseHandle = throttle((arrow) => {
  const oldCellList = JSON.parse(JSON.stringify(cellList.value))
  if(arrow === 1) cellList.value = upHandle() 
  if(arrow === 2) cellList.value = downHandle()
  if(arrow === 3) cellList.value = leftHandle()
  if(arrow === 4) cellList.value = rightHandle() 
  if(isChangeCell(cellList.value, oldCellList)) {
    setTimeout(generateCell, 250)
  }
}, 250, { leading: true, trailing: false })

//向上滑动
const upHandle = () => {
  const newCellList = JSON.parse(JSON.stringify(cellList.value))
  for (let col = 0; col <= newCellList[0].length - 1; col++) {
    for(let raw = 0; raw <= newCellList.length - 1; raw++) {
      let n = newCellList.length - 1 - raw
      while(n--) {
        if(newCellList[raw][col].value === 0) { //如果有0值则后面的值都推前一位
          for(let e = raw; e <= newCellList.length - 2; e++) {
            newCellList[e][col].value = newCellList[e+1][col].value
          }
          newCellList[newCellList.length - 1][col].value = 0 //最后一个用0补充
        } else {
          break
        }
      }
    }
    for(let raw = 0; raw <= newCellList.length - 2; raw++) {
      if(newCellList[raw][col].value != 0 && newCellList[raw][col].value === newCellList[raw+1][col].value) { //如果后一位值和当前值相等则相加，后面的值都推前一位
        newCellList[raw][col].value += newCellList[raw+1][col].value
        totalGoal.value += newCellList[raw][col].value
        for(let e = raw+1; e <= newCellList.length - 2; e++) {
          newCellList[e][col].value = newCellList[e+1][col].value
        }
        newCellList[newCellList.length - 1][col].value = 0 //最后一个用0补充
      }
    }
  }
  return newCellList
}


//向下滑动
const downHandle = () => {
  const newCellList = JSON.parse(JSON.stringify(cellList.value))
  for (let col = newCellList[0].length - 1; col >= 0; col--) {
    for(let raw = newCellList.length - 1; raw >= 0; raw--) {
      let n = raw
      while(n--) {
        if(newCellList[raw][col].value === 0) { //如果有0值则后面的值都推前一位
          for(let e = raw; e >= 1; e--) {
            newCellList[e][col].value = newCellList[e-1][col].value
          }
          newCellList[0][col].value = 0 //最后一个用0补充
        } else {
          break
        }
      }
    }
    for(let raw = newCellList.length - 1; raw >= 1; raw--) {
      if(newCellList[raw][col].value != 0 && newCellList[raw][col].value === newCellList[raw-1][col].value) { //如果后一位值和当前值相等则相加，后面的值都推前一位
        newCellList[raw][col].value += newCellList[raw-1][col].value
        totalGoal.value += newCellList[raw][col].value
        for(let e = raw-1; e >= 1; e--) {
          newCellList[e][col].value = newCellList[e-1][col].value
        }
        newCellList[0][col].value = 0 //最后一个用0补充
      }
    }
  }
  return newCellList
}

//向左滑动
const leftHandle = () => {
  const newCellList = JSON.parse(JSON.stringify(cellList.value))
  for(let raw = 0; raw <= newCellList.length - 1; raw++) {
    for (let col = 0; col <= newCellList[0].length - 1; col++) {
      let n = newCellList.length - 1 - col
      while(n--) {
        if(newCellList[raw][col].value === 0) { //如果有0值则后面的值都推前一位
          for(let e = col; e <= newCellList[0].length - 2; e++) {
            newCellList[raw][e].value = newCellList[raw][e+1].value
          }
          newCellList[raw][newCellList[0].length - 1].value = 0 //最后一个用0补充
        } else {
          break
        }
      }
    }
    for (let col = 0; col <= newCellList[0].length - 2; col++) {
      if(newCellList[raw][col].value != 0 && newCellList[raw][col].value === newCellList[raw][col+1].value) { //如果后一位值和当前值相等则相加，后面的值都推前一位
        newCellList[raw][col].value += newCellList[raw][col+1].value
        totalGoal.value += newCellList[raw][col].value
        for(let e = col+1; e <= newCellList[0].length - 2; e++) {
          newCellList[raw][e].value = newCellList[raw][e+1].value
        }
        newCellList[raw][newCellList[0].length - 1].value = 0 //最后一个用0补充
      }
    }
  }
  return newCellList
}

//向右滑动
const rightHandle = () => {
  const newCellList = JSON.parse(JSON.stringify(cellList.value))
  for(let raw = newCellList.length - 1; raw >= 0; raw--) {
    for (let col = newCellList[0].length - 1; col >= 0; col--) {
      let n = col
      while(n--) {
        if(newCellList[raw][col].value === 0) { //如果有0值则后面的值都推前一位
          for(let e = col; e >=1; e--) {
            newCellList[raw][e].value = newCellList[raw][e-1].value
          }
          newCellList[raw][0].value = 0 //最后一个用0补充
        } else {
          break
        }
      }
    }
    for (let col = newCellList[0].length - 1; col >= 1; col--) {
      if(newCellList[raw][col].value != 0 && newCellList[raw][col].value === newCellList[raw][col-1].value) { //如果后一位值和当前值相等则相加，后面的值都推前一位
        newCellList[raw][col].value += newCellList[raw][col-1].value
        totalGoal.value += newCellList[raw][col].value
        for(let e = col-1; e >= 1; e--) {
          newCellList[raw][e].value = newCellList[raw][e-1].value
        }
        newCellList[raw][0].value = 0 //最后一个用0补充
      }
    }
  }
  return newCellList
}


//键盘操作
const keyHandle = () => {
document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp') {
    // 用户按下了上箭头键
    baseHandle(1)
  } else if (event.key === 'ArrowDown') {
    // 用户按下了下箭头键
    baseHandle(2)
  } else if (event.key === 'ArrowLeft') {
    // 用户按下了左箭头键
    baseHandle(3)
  } else if (event.key === 'ArrowRight') {
    // 用户按下了右箭头键
    baseHandle(4)
  }
});

}

onMounted(() => {
  init()
  keyHandle()
})

</script>
<style scoped lang="less">
.main-box{
  width: 500px;
  background: #f8f3dc;
  padding:24px;
  box-sizing: border-box;
  border-radius: 16px;
  .header{
    .score-box{
      width: 72px;
      background: #B8ADA1;
      margin-bottom: 24px;
      border-radius: 8px;
      padding: 8px 0;
      &.begin{
        background: #E19C66;
        color: #fff;
      }
    }
  }
  .section{
    width: 100%;
    box-sizing: border-box;
    aspect-ratio: 1;
    padding: 5px;
    background: #B7ACA1;
    border-radius: 6px;
    .cell-box{
      width: 100%;
      .cell{
        width: 25%;
        aspect-ratio: 1;
        margin: 5px;
        font-size: 36px;
        font-weight: bold;
        background: #C8BEB2;
        border-radius: 6px;
        transition: all .2s;
      }
    }
  }
}
</style>