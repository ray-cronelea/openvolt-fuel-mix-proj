<template>
  <div class="hello">
    <section v-if="errored">
      <p>Error</p>
    </section>

    <section v-else>
      <div v-if="loading">Loading...</div>

      <div v-else>
        <el-statistic :value="energy_consumed_content">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Energy Consumed
            </div>
          </template>
          <template #suffix>kWh</template>
        </el-statistic>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import axios from 'axios';

export default {
  data() {
    return {
      energy_consumed_content: null,
      loading: true,
      errored: false
    };
  },
  props: {
    reqDate: {
      default: '2023-01'
    }
  },
  watch: {
    reqDate: function(newReqDate) {
      this.getOrder(newReqDate);
    }
  },
  created() {
    this.getOrder(this.reqDate);
  },
  methods: {
    getOrder(reqDateIn) {
      this.loading = true;
      this.errored = false;

      console.log(reqDateIn)


      const params = {
        reqDate: reqDateIn
      };

      console.log(`energy-consumed params: ${JSON.stringify(params)}`);

      axios
        .get('api/energy-consumed', { params })
        .then((response) => {
          console.log(response.data);
          this.energy_consumed_content = Number(response.data.energyConsumed);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
