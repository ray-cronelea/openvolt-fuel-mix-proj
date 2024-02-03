<template>
  <div class="hello">
    <section v-if="errored">
      <p>Error</p>
    </section>

    <section v-else>
      <div v-if="loading">Loading...</div>

      <div v-else>
        <el-statistic :value="carbon_emitted_content.carbonEmit">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Carbon Emitted
            </div>
          </template>
          <template #suffix>gCO2</template>
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
  props: {
    reqDate: {
      default: '2023-01-01T00:00:00.000Z',
    },
  },
  watch: {
    reqDate: function (newReqDate) {
      this.getOrder(newReqDate);
    },
  },
  created() {
    this.getOrder(this.reqDate);
  },
  methods: {
    getOrder(reqDateIn) {
      this.loading = true;
      this.errored = false;

      const params = {
        reqDate: reqDateIn,
      };

      axios
        .get('api/carbon-emitted', { params })
        .then((response) => {
          console.log(response.data);
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
