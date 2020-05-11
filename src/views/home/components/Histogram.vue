<template>
  <div style="width:90%;height:130px;">
    <div ref="mountNode"></div>
  </div>
</template>

<script>
import G2 from "@antv/g2";
import DataSet from "@antv/data-set";
export default {
  name: "histogram",
  props: {
    chartData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted() {
    this.draw();
  },
  methods: {
    /**
     * @method draw 获取参数配置信息
     */
    draw() {
      var chart = new G2.Chart({
        container: this.$refs.mountNode,
        forceFit: true,
        height: "120",
        padding: [30, 0,0, 30]
      });
      this.chart = chart;
      this.loadChart();
    },
    loadChart() {
      this.chart.source(this.chartData);
      this.chart.scale("total", {
        alias: `数量`
      });
    
      this.chart
        .interval()
        .position("name*total")
        .label("name*total", {
          textStyle: {
            fill:'#ffffff'
          }
        })
        .color("l(270) 0:#0062d2 1:#35d2fd")
        .style({
          cursor: "pointer"
        });
      this.chart.render();
    }
  }
};
</script>

<style lang="less" scoped>
</style>