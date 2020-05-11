<template>
  <div ref="map" style="height:390px;"></div>
</template>

<script>
import china from 'echarts/map/json/china.json'
export default {
  name: "echart-map",
  data() {
    return {
      chart: null
    };
  },
  methods: {
    init() {
      this.chart = this.$echarts.init(this.$refs["map"]);
      this.$echarts.registerMap('china', china);
      this.chart.setOption({
        geo: {
          map: "china",
          zoom: 1.2,
          label: {
            show: false,
            color: "white"
          }
        },
        itemStyle: {
          areaColor: "rgba(00, 64, 151, 0.8)", 
          // areaColor:{
          //   type: 'radial',
          //   x:0.5,
          //   y:0.5,
          //   r:0.5,
          //   colorStops:[
          //     {
          //       offset:0, color:'rgba(00, 140, 214, 0.9)'
          //     },
          //     {
          //       offset:1,color: 'rgba(00, 64, 151, 0.9)'
          //     }
          //   ],
          // },
          borderColor: "#dddddd",
          shadowColor: "#dddddd",
          shadowOffsetX: 1,
          shadowOffsetY: 1,
          shadowBlur: 5
        },
        //高亮样式。
        emphasis: {
          itemStyle: {
            // 高亮时点的颜色。
            areaColor: "#FCFCFC"
          },
          label: {
            show: true,
            // 高亮时标签的文字。
            color: "#3A3A3A"
          }
        },
        label: {
          show: true,
          color: "white",
          position: "inside"
        },
        series: [
          {
            name: "台站", // series名称
            type: "scatter", // series图表类型
            coordinateSystem: "geo", // series坐标系类型
            data: this.stations, // series数据内容
            itemStyle: {
              color: "rgba(122, 96, 41, 0.5)"
            },
            label: {
              normal: {
                formatter: "{b}",
                position: "top",
                show: true
              }
            }
          }
        ]
      });
    }
  },
  mounted() {
      this.init();
  }
};
</script>

<style lang="less" scoped>
</style>