<script lang="ts" setup>
import EnergyConsumed from './EnergyConsumed.vue';
import CarbonEmitted from './CarbonEmitted.vue';
import { ref } from 'vue';
import FuelMix from './FuelMix.vue';

defineProps<{}>();

const selectedMonth = ref('2023-01');
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div id="commands" class="rounded shadow">
        <el-row>
          <el-col>
            <div class="block">
              <div>fix timestamp</div>
              <el-date-picker
                v-model="selectedMonth"
                :clearable=false
                placeholder="Pick a month"
                type="month"
                format="YYYY-MM"
                value-format="YYYY-MM"
              />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <EnergyConsumed :reqDate=selectedMonth></EnergyConsumed>
          </el-col>
          <el-col :span="12">
            <CarbonEmitted :reqDate=selectedMonth></CarbonEmitted>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <FuelMix :reqDate=selectedMonth></FuelMix>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style>
#commands {
  padding: 2.5rem 2rem;
  margin-top: 3.5rem;
  background: white;
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

.el-col {
  text-align: center;
}
.el-row {
  margin-bottom: 2rem;
}
.el-input__inner {
  text-align: center
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
