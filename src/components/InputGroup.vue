<template>
  <div>
    <el-form-item label="原生输入框（异 context）">
      <input
        class="el-input__inner"
        name="test3"
        v-vld="'required'"
        scope="myScoped"
        v-model="waitForValidate"
      />
      <div id="show-error">{{ errList['test3'] }}</div>
    </el-form-item>
    <el-form-item label="组件输入框（异 context）">
      <el-input
        name="el-test3"
        v-vld="'required'"
        scope="myScoped"
        v-model="elementValidate"
      ></el-input>
      <div id="show-error">{{ errList['el-test3'] }}</div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  data() {
    return {
      waitForValidate: '',
      elementValidate: '',
    }
  },
}
</script>

<style></style>
