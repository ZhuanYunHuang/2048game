<template>
  <div class="main-box flexMainYXcenter">
     <div class="header">
      <div class="score-box flexMainYXcenter">
        <span>分数</span>
        <span style="margin-top: 6px;">0</span>
      </div>
      <div class="score-box begin">开始</div>
     </div>
     <div class="section">
      <tr v-for="(rowItem, rowIndex) in cellList" :key="rowIndex" class="cell-box flexMainXYcenter">
        <td v-for="cellItem in rowItem" :key="cellItem.id" class="cell"></td>
      </tr>
     </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cellList = ref([
  [ { id: '0-0' }, { id: '0-1' }, { id: '0-2' }, { id: '0-3' } ],
  [ { id: '1-0' }, { id: '1-1' }, { id: '1-2' }, { id: '1-3' } ],
  [ { id: '2-0' }, { id: '2-1' }, { id: '2-2' }, { id: '2-3' } ],
  [ { id: '3-0' }, { id: '3-1' }, { id: '3-2' }, { id: '3-3' } ],
])

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