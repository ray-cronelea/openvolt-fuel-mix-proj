<script setup lang="ts">
import EnergyConsumed from './EnergyConsumed.vue';
import { myLib } from '@new-workspace/my-lib';
import { useTransition } from '@vueuse/core';
import { ChatLineRound, Lightning } from '@element-plus/icons-vue';
import { ref } from 'vue';

defineProps<{
  title: string;
}>();
const message = myLib();
const source = ref(0);
const outputValue = useTransition(source, {
  duration: 1500,
});
source.value = 172000;
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div id="commands" class="rounded shadow">
        <el-row>
          <el-col :span="6">
            <el-statistic :value="138">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  Energy Consumed
                  <el-icon style="margin-left: 4px" :size="12">
                    <Lightning />
                  </el-icon>
                </div>
              </template>
              <template #suffix>kWh</template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic :value="138">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  CO2 Emitted
                  <el-icon style="margin-left: 4px" :size="12">
                    <Lightning />
                  </el-icon>
                </div>
              </template>
              <template #suffix>Kg</template>
            </el-statistic>
          </el-col>
          <el-col :span="6">
            <el-statistic title="Total Transactions" :value="outputValue" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="Feedback number" :value="562">
              <template #suffix>
                <el-icon style="vertical-align: -0.125em">
                  <ChatLineRound />
                </el-icon>
              </template>
            </el-statistic>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="container">
      <EnergyConsumed />
    </div>
  </div>
</template>

<style scoped>
#commands {
  padding: 2.5rem 2rem;
  margin-top: 3.5rem;
}
.el-col {
  text-align: center;
}
.shadow {
  box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.rounded {
  border-radius: 1.5rem;
}
.wrapper {
  width: 100%;
}
.container {
  margin-left: auto;
  margin-right: auto;
  max-width: 768px;
  padding-bottom: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  color: rgba(55, 65, 81, 1);
  width: 100%;
}
</style>
