<template>
  <div class="main-box flexMainYXcenter">
     <div class="header">
      <div class="flexMainXYcenter">
        <div class="score-box flexMainYXcenter">
          <span>分数</span>
          <span style="margin-top: 6px;">{{ totalGoal }}</span>
        </div>
        <div> 
          <div @click="upHandle">上</div>
          <div>下</div>
          <div>左</div>
          <div>右</div>
        </div>
      </div>
      <div class="score-box begin" @click="init">开始</div>
     </div>
     <div class="section">
      <tr v-for="(rowItem, rowIndex) in cellList" :key="rowIndex" class="cell-box flexMainXYcenter">
        <td v-for="cellItem in rowItem" :key="cellItem.id" class="cell flexMainXcenter" :style="`color: ${getNumColor(cellItem.value)}; background: ${getBgColor(cellItem.value)}`">
          {{ cellItem.value }}
        </td>
      </tr>
     </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getNumColor, getBgColor } from '@/assets/enum'

const cellList = ref([
  [ { id: '0-0', value: 0 }, { id: '0-1', value: 0 }, { id: '0-2', value: 0 }, { id: '0-3', value: 0 } ],
  [ { id: '1-0', value: 0 }, { id: '1-1', value: 0 }, { id: '1-2', value: 0 }, { id: '1-3', value: 0 } ],
  [ { id: '2-0', value: 0 }, { id: '2-1', value: 0 }, { id: '2-2', value: 0 }, { id: '2-3', value: 0 } ],
  [ { id: '3-0', value: 0 }, { id: '3-1', value: 0 }, { id: '3-2', value: 0 }, { id: '3-3', value: 0 } ],
])

const totalGoal = computed(() => {
  let goal = 0
  cellList.value.forEach(i => i.forEach(e => goal += e.value))
  return goal
})

const init = () => {
  cellList.value.forEach((item) => {
    item.forEach((_item) => {
      _item.value = 0
    })
  })
  generateCell(2, 2)
}

//随机生产方块
const generateCell = (_num, _value) => {
  const num = _num || Math.floor(Math.random() * 2) + 1 //随机生成1个或2个方块
  const canList = ['0-0', '1-0'] //可以生成的格子列表(value为0)
  // cellList.value.forEach((item) => {
  //   item.forEach((_item) => {
  //     if(_item.value === 0) {
  //       canList.push(_item.id)
  //     }
  //   })
  // })
  let n = num
  let canListLen = canList.length

  const newCellList = []
  while(n--) {
    const cellData = {
      id: null,
      value: _value || (Math.floor(Math.random() * 10) > 8 ? 4 : 2) //生成2的概率80，4的概率20
    }
    let newCell = Math.floor(Math.random() * canListLen)
    while(newCellList.find(item => item.id === newCell)) {
      newCell = Math.floor(Math.random() * canListLen) //防止生成在同一格子
    }
    cellData.id = canList[newCell]
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
  console.log(newCellList);
}

//滑动后是否有值改变，不改变则不生成新方块
const isChangeCell = (newList, oldList) => {
  for (let i = 0; i < oldList.length; i++) {
    for (let j = 0; j < oldList[i].length; j++) {
      if(oldList[i][j].value !== newList[i][j].value) {
        return true
      }
    }  
  }
  return false
}

//向上滑动
const upHandle = () => {
  const oldCellList = JSON.parse(JSON.stringify(cellList.value))
  for (let col = 0; col < cellList.value[0].length; col++) {
    for(let raw = 0; raw <= cellList.value.length - 1; raw++) {
      // const currentCell = cellList.value[raw][col]
      let n = cellList.value.length - 1 - raw
      while(n--) {
        if(cellList.value[raw][col].value === 0) { //如果有0值则后面的值都推前一位
          for(let e = raw; e <= cellList.value.length - 2; e++) {
            cellList.value[e][col].value = cellList.value[e+1][col].value
          }
        } else if(cellList.value[raw][col].value === cellList.value[raw+1][col].value) { //如果后一位值和当前值相等则相加，后面的值都推前一位
          cellList.value[raw][col].value += cellList.value[raw+1][col].value
          for(let e = raw+1; e <= cellList.value.length - 2; e++) {
            cellList.value[e][col].value = cellList.value[e+1][col].value
          }
        }
      }
    }
  }
  if(isChangeCell(cellList.value, oldCellList)) {
    generateCell()
  }
}

onMounted(() => {
  init()
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
        background: #C8BEB2;
        border-radius: 6px;
      }
    }
  }
}
</style>