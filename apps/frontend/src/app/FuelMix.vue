<script setup lang="ts">

import { VueUiSparkStackbar } from "vue-data-ui";
import 'element-plus/dist/index.css';

const config = {"style":{"backgroundColor":"#ffffff","fontFamily":"inherit","bar":{"gradient":{"show":false,"intensity":40,"underlayerColor":"#FFFFFF"}},"legend":{"margin":"6px 0 0 0","textAlign":"center","show":true,"fontSize":12,"name":{"color":"#2D353C","bold":false},"value":{"show":true,"bold":false,"color":"#2D353C","prefix":"","suffix":"kW","rounding":0},"percentage":{"show":true,"bold":true,"color":"#2D353C","rounding":1}},"title":{"textAlign":"center","text":"Fuelmix","color":"#2D353C","fontSize":16,"bold":true,"margin":"0 0 6px 0","subtitle":{"color":"#A1A1A1","text":"","fontSize":12,"bold":false}}}}
</script>

<script lang="ts">
import axios from 'axios';

function mapData(data: {productionType: string, kilowatt: number}[]) : {name: string, value: number}[] {
  let mappedData: {name: string, value: number}[] = [];
  for (let datum of data) {
    mappedData.push({name: datum.productionType, value: datum.kilowatt})
  }
  return mappedData;
}

export default {
  data() {
    return {
      carbon_emitted_content: [],
      loading: true,
      errored: false
    };
  },
  props: {
    reqDate: {
      default: '2023-01-01T00:00:00.000Z'
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

      const params = {
        reqDate: reqDateIn
      };

      axios
        .get('api/energy-mix', { params })
        .then((response) => {
          console.log(response.data);
          return response.data;
        })
        .then((json)=>{
          console.log(json.data);
          return json.data;
        }).then((data) => {
          this.carbon_emitted_content = mapData(data);
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

<template>
  <div class="wrapper">
        <VueUiSparkStackbar
          :dataset="carbon_emitted_content"
          :config="config"/>
  </div>
</template>

<style scoped>

</style>
