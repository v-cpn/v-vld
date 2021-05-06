<template>
  <div id="app">
    <el-form ref="form" label-width="100px">
      <el-form-item label="原生输入框">
        <input
          class="el-input__inner"
          name="test"
          v-vld="'required'"
          scope="myScoped"
          v-model="waitForValidate"
        />
        <div id="show-error">{{ errList['test'] }}</div>
      </el-form-item>
      <el-form-item label="组件输入框">
        <el-input
          name="el-test"
          v-vld="'required'"
          scope="myScoped"
          v-model="elementValidate"
        ></el-input>
        <div id="show-error">{{ errList['el-test'] }}</div>
      </el-form-item>
      <el-form-item label="原生输入框（无 scope）">
        <input
          class="el-input__inner"
          name="test2"
          v-vld="'required'"
          v-model="waitForValidate2"
        />
        <div id="show-error">{{ errList['test2'] }}</div>
      </el-form-item>
      <el-form-item label="组件输入框（无 scope）">
        <el-input
          name="el-test2"
          v-vld="'required'"
          v-model="elementValidate2"
        ></el-input>
        <div id="show-error">{{ errList['el-test2'] }}</div>
      </el-form-item>
      <InputGroup ref="inputGroup" />
      <div>
        <el-button class="button" type="primary" @click="onValidate"
          >校验全部</el-button
        >
        <el-button class="button" type="primary" @click="onValidateScope"
          >校验 Scope</el-button
        >
        <el-button class="button" type="primary" @click="onValidateOtherContext"
          >校验其他组件</el-button
        >
      </div>
      <div>
        <el-button class="button" @click="onClear">清除校验错误</el-button>
        <el-button class="button" @click="onClearScope"
          >清除 Scope 校验错误</el-button
        >
        <el-button class="button" @click="onClearOtherContext"
          >清除其他组件校验错误</el-button
        >
      </div>
    </el-form>
    <el-form ref="form" label-width="100px">
      <el-form-item label="X">
        <input
          class="el-input__inner"
          name="x"
          v-vld="'required'"
          scope="联动校验"
          v-model="x"
        />
        <div id="show-error">{{ errList['x'] }}</div>
      </el-form-item>
      <el-form-item label="小于等于 X">
        <el-input
          name="y"
          v-vld="'lteX:' + x"
          scope="联动校验"
          v-model="y"
        ></el-input>
        <div id="show-error">{{ errList['y'] }}</div>
      </el-form-item>
      <div>
        <el-button class="button" type="primary" @click="onValidateCrossField"
          >联动校验</el-button
        >
        <el-button class="button" @click="onClearCrossField"
          >清除联动校验</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import InputGroup from './components/InputGroup'
export default {
  name: 'App',
  components: { InputGroup },
  data() {
    return {
      waitForValidate: '',
      elementValidate: '',
      waitForValidate2: '',
      elementValidate2: '',
      x: 0,
      y: 0,
    }
  },
  methods: {
    onValidate() {
      const error = this.$vld()
      error.length > 0 && console.warn(error)
    },
    onValidateScope() {
      const error = this.$vld('myScoped')
      error.length > 0 && console.warn(error)
    },
    onValidateOtherContext() {
      const error = this.$refs.inputGroup.$vld()
      error.length > 0 && console.warn(error)
    },
    onClear() {
      this.$vldClr()
    },
    onClearScope() {
      this.$vldClr('myScoped')
    },
    onClearOtherContext() {
      this.$refs.inputGroup.$vldClr()
    },
    onValidateCrossField() {
      const error = this.$vld('联动校验')
      error.length > 0 && console.warn(error)
    },
    onClearCrossField() {
      this.$vldClr('联动校验')
    },
  },
}
</script>

<style>
#app {
  width: 800px;
  margin: auto;
}
#show-error {
  color: red;
}
.button {
  margin-bottom: 20px;
}
</style>
