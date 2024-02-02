<template>
  <div class="hello">
    <section v-if="errored">
      <p>Error</p>
    </section>

    <section v-else>
      <div v-if="loading">Loading...</div>

      <div v-else>
        <el-statistic :value=carbon_emitted_content.carbonEmitted>
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Carbon Emitted
            </div>
          </template>
          <template #suffix>Kg</template>
        </el-statistic>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      carbon_emitted_content: null,
      loading: true,
      errored: false,
    };
  },
  created() {
    this.getOrder();
  },
  methods: {
    getOrder(id) {
      axios
        .get('api/carbon-emitted')
        .then((response) => {
          this.carbon_emitted_content = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
