<template>
  <div v-if="isTimelineBuilt">
    <apexchart type="area"
               :width="'100%'"
               height="300"
               :options="options"
               :series="series">
    </apexchart>
  </div>
</template>

<script lang="ts">
  import { Component, Vue} from 'vue-property-decorator';
  import { IInventoryTimeLine, ISnapshot } from '@/types/InventoryGraph';
  import VueApexcharts from 'vue-apexcharts';
  Vue.component('apexchart', VueApexcharts);
  import store from '@/store/store';

  @Component({
    name: 'InventoryChart',
    components: {}
  })
  export default class InventoryChart extends Vue {

    get options() {
      return {
        dataLabels: { enabled: false },
        fill: { type: 'gradient' },
        stroke: { curve: 'smooth' },

        // Important: USE CATEGORIES ONLY FOR CATEGORIES TYPE OF CHARTS
        // xaxis: { categories: this.$store.state.inventory.snapshotTimeLine.timeline,
        //          type: 'datetime', 
        //          labels: { datetimeUTC: false }

        // Working example using 'datetime' in xaxis reference: https://codepen.io/apexcharts/pen/eVvjZx
        // References: https://github.com/apexcharts/apexcharts.js/issues/209
        xaxis: { 
          type: 'datetime', 
          labels: { datetimeUTC: false }
        }
      }
    }

    get isTimelineBuilt() {
      console.log(this.$store.state.inventory.isTimelineBuilt);
      return this.$store.state.inventory.isTimelineBuilt;
    }

    async created() {
      await this.$store.dispatch('assignSnapshots');
    }

    get series() {
      return this.$store.state.inventory.snapshotTimeLine
                              .productInventorySnapshot
                              .map((snapshot: any) => ({ name: snapshot.productId,
                                                         data: snapshot.data.map( (item: any) => {
                                                           return {
                                                             x: item.snapshotTime,
                                                             y: item.quantityOnHand
                                                           };
                                                         })
                              }));
        //     return [
        //   {
        //     name: "Series  1",
        //     data: [
        //       {
        //         x: "2020-08-06T16:57:58.9210129",
        //         y: 34
        //       },
        //       {
        //         x: "2020-08-06T16:58:36.4895747",
        //         y: 43
        //       },
        //       {
        //         x: "2020-08-06T16:59:11.8924829",
        //         y: 31
        //       },
        //       {
        //         x: "2020-08-06T17:00:08.24693",
        //         y: 43
        //       },
        //       {
        //         x: "2020-08-06T17:00:21.7320298",
        //         y: 33
        //       },
        //       {
        //         x: "2020-08-06T17:00:49.1939787",
        //         y: 52
        //       },
        //       {
        //         x: "2020-08-06T17:45:07.2482814",
        //         y: 400
        //       }
        //     ]
        //   }
        // ]
    }
  }
</script>

<style scoped lang="scss">

</style>