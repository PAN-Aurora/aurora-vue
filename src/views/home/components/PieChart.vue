<template>
  <div style="width:90%">
    <div ref="mountNode"></div>
  </div>
</template>

<script>
import G2 from "@antv/g2";
import DataSet from "@antv/data-set";
export default {
  name: "histogram",
  data() {
    return {
      chart: null,
      chartData: [
        {
          item: "电视剧",
          count: 40,
          percent: 0.4
        },
        {
          item: "电影",
          count: 21,
          percent: 0.21
        },
        {
          item: "高清",
          count: 17,
          percent: 0.17
        },
        {
          item: "体育",
          count: 13,
          percent: 0.13
        },
        {
          item: "娱乐",
          count: 9,
          percent: 0.09
        },
      ]
    };
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
        height: "130",
        padding: 0
      });
      this.chart = chart;
      this.loadChart();
    },
    loadChart() {
      this.chart.source(this.chartData, {
        percent: {
          formatter: function formatter(val) {
            val = val * 100 + "%";
            return val;
          }
        }
      });
      this.chart.legend(false); 
      this.chart.coord("theta", {
        radius: 0.75
      });
      this.chart.tooltip({
        showTitle: false,
      });
      this.chart
        .intervalStack()
        .position("percent")
        .color("item")
        .label("percent", {
          formatter: function formatter(val, item) {
            return item.point.item + ": " + val;
          },
          textStyle: {
            fill:'#ffffff'
          }
        })
        .tooltip("item*percent", function(item, percent) {
          percent = percent * 100 + "%";
          return {
            name: item,
            value: percent
          };
        })
        .style({
          lineWidth: 1,
          stroke: "#fff",
        });
      this.chart.render();
    }
  }
};
</script>

<style lang="less" scoped>
</style>