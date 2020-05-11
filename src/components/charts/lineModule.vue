<template>
    <div style="margin-left:-2em;">
      <h3 style="text-align:center">{{title ? title : ''}}</h3>
      <div id="mountNode"></div>
    </div>
</template>
<script>
import { setTimeout } from "timers";
export default {
  props: ["xProp", "yProp", "height", 'title'],
  data() {
    return {
      chart:null
    }
  },
  methods: {
    initial(data) {
      document.getElementById('mountNode').innerHTML = ''
      let chart = new G2.Chart({
        container: "mountNode",
        forceFit: true,
        height: this.height,
        padding: ['auto',80]
      });
      chart.source(data);
      chart.scale(this.yProp, { min: 0 });
      chart.scale(this.xProp, { range: [0, 1] });
      chart.tooltip({
        crosshairs: {
          type: "line"
        }
      });
      chart.line().position(`${this.xProp}*${this.yProp}`);
      chart
        .point()
        .position(`${this.xProp}*${this.yProp}`)
        .size(4)
        .shape("circle")
        .style({
          stroke: "#fff",
          lineWidth: 1
        });
      chart.render();
      this.chart = chart;
    },
    reRender(){
      if(this.chart){
          this.chart.render();
      }
    }
  },
  mounted() {
  }
};
</script>