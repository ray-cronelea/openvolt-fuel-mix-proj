<script setup>
import { ref } from 'vue'
import axios from "axios";

window.axios = axios;

const count = ref(0)

  function doSomething() {
    count++;
    axios
      .get('http://localhost:4200/api')
      .then((response) => {
        console.log(response.data)
      })
}


</script>

<template>
  <button @click="doSomething()">You clicked me {{ count }} times.</button>
</template>