<template>
  <div id="app">
    <input
      name="test"
      v-vld="'required'"
      scope="myScoped"
      v-model="waitForValidate"
    />
    <div id="show-error">{{ errList["test"] }}</div>
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
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
