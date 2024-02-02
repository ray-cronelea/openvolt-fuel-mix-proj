<script setup lang="ts">
import EnergyConsumed from './EnergyConsumed.vue';
import CarbonEmitted from './CarbonEmitted.vue';
import { myLib } from '@new-workspace/my-lib';
import { ChatLineRound, Lightning } from '@element-plus/icons-vue';
import { ref } from 'vue';

defineProps<{
  title: string;
}>();

const selectedMonth = ref(new Date('2023-01'));
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div id="commands" class="rounded shadow">
        <el-row>
          <el-col>
            <div class="block" justify="center">
              <el-date-picker
                v-model="selectedMonth"
                type="month"
                placeholder="Pick a month"
              />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <EnergyConsumed :reqDate=selectedMonth> </EnergyConsumed>
          </el-col>
          <el-col :span="12">
            <CarbonEmitted />
          </el-col>
        </el-row>
      </div>
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
.el-row {
  margin-bottom: 2rem;
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
