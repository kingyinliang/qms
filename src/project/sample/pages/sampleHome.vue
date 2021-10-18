<template>
  <div class="home">
    <div class="home__btn" @click="$router.push({ name: 'sampleDelivery' })">
      <i class="qmsIconfont qms-shouyang1"/>
      <p>送样</p>
    </div>
    <div style="width: 108px"/>
    <div class="home__btn" @click="$router.push({ name: 'sampleCollection' })">
      <i class="qmsIconfont qms-shouyang"/>
      <p>收样</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'sampleHome',
  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.home{
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  &__btn{
    cursor: pointer;
    width: 194px;
    height: 181px;
    background: #487BFF;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    color: white;

    i{
      font-size: 58px;
      margin-bottom: 12px;
    }
    p{
      font-size: 42px;
    }
  }
}
</style>
