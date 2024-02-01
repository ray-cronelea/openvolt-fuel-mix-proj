<template>
  <div class="hello">
    <div v-if="energy_consumed_content">
          <p>{{energy_consumed_content.energyConsumed}}</p>
    </div>
    <div v-else>
      No content
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      energy_consumed_content: {}
    }
  },
  created() {
    this.getOrder();
  },
  methods: {
    getOrder(id) {
      axios.get("api/energy-consumed")
        .then(response => {
          this.energy_consumed_content = response.data;
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
