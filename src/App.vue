<template>
  <div id="app">
    <input
      name="test"
      v-vld="'required'"
      scope="myScoped"
      v-model="waitForValidate"
    />
    <div id="show-error">{{ errList["test"] }}</div>
    <button @click="onValidate">校验</button>
    <button @click="onClear">清除校验错误</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      waitForValidate: "",
    };
  },
  methods: {
    onValidate() {
      this.$vld();
    },
    onClear() {
      this.$vldClr();
    },
  },
};
</script>

<style>
#app {
  text-align: center;
}
#show-error {
  color: red;
}
</style>
