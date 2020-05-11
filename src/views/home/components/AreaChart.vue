<template>
  <div style="width:96%">
    <div ref="mountNode"></div>
  </div>
</template>

<script>
import G2 from "@antv/g2";
import DataSet from "@antv/data-set";
export default {
  name: "area-chart",
  data() {
    return {
      chart: null,
      countrys : ["北京","河北","广州","上海","深圳","成都"],
      xDate: ['01','02','03','04','05','06'],
      chartData: []
    };
  },
  mounted() {
    this.init();
    this.draw();
  },
  methods: {

    //数据初始化
    init(){
      for(let i = 0; i < this.countrys.length; i++){
       
       
        for(let j=0; j < this.xDate.length;j++){
           let item = {};
          item.country = this.countrys[i];
          item.date = this.xDate[j];
          item.value = Math.ceil(Math.random()*1000); 
          this.chartData.push(item);
        }
      
    
      }
    },
    /**
     * @method draw 获取参数配置信息
     */
    draw() {
      const chart = new G2.Chart({
        container: this.$refs.mountNode,
        forceFit: true,
        height: "200",
        padding: [30, 0, 80, 0]
      });
      this.chart = chart;
      this.loadChart();
    },
    loadChart() {
      const that = this;
      var chartType = 1;
      var ds = new DataSet();
      var dv = ds.createView().source(this.chartData);
      dv.transform({
        type: "percent",
        field: "value",
        dimension: "country",
        groupBy: ["date"],
        as: "percent"
      });
      this.chart.source(dv, {
        percent: {
          max: 1.0,
          min: 0.0,
          nice: false,
          formatter: function formatter(value) {
            value = value || 0;
            value = value * 100;
            return parseInt(value);
          }
        }
      });
      this.chart.scale("Year", {
        range: [0, 1],
        tickCount: 10,
        type: "timeCat"
      });
      //   this.chart.tooltip({
      //     crosshairs: "y",
      //     htmlContent: function htmlContent(title, items) {
      //       var html = '<div class="g2-tooltip">';
      //       var titleDom =
      //         '<div class="g2-tooltip-title" style="margin-bottom: 4px;">' +
      //         title +
      //         "</div>";
      //       var listDom = '<ul class="g2-tooltip-list">';
      //       var sum = 0;
      //       for (var i = 0; i < items.length; i++) {
      //         var item = items[i];
      //         var itemDom =
      //           "<li data-index={index}>" +
      //           '<span style="background-color:' +
      //           item.color +
      //           ';width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>' +
      //           item.name +
      //           '<span class="g2-tooltip-value">' +
      //           item.value +
      //           "</span>" +
      //           "</li>";
      //         listDom += itemDom;
      //         sum += parseFloat(item.value);
      //       }
      //       listDom += "</ul>";
      //       var sumDom =
      //         '<li class="g2-tooltip-statistic">总计：<span class="g2-tooltip-statistic-value">' +
      //         sum.toFixed(2) +
      //         "</span></li>";
      //       if (chartType === 1) {
      //         return html + titleDom + sumDom + listDom + "</div>";
      //       } else {
      //         return html + titleDom + listDom + "</div>";
      //       }
      //     }
      //   });
      this.chart.legend({
        position: "top",
        attachLast: false
      });
      chartType1();
      that.chart.axis("value", false);
      this.chart.render();
      //   $(".toolbox-button").click(function(event) {
      //     var $dom = $(event.target);
      //     var index = $dom.data().index;
      //     chartType = index;
      //     $(".toolbox-button").removeClass("button-selected");
      //     $dom.addClass("button-selected");
      //     if (index === 1) {
      //       this.chart.clear();
      //       chartType1();
      //       this.chart.repaint();
      //     } else {
      //       this.chart.clear();
      //       chartType2();
      //       this.chart.repaint();
      //     }
      //   });

      function chartType1() {
        console.log(that);
        that.chart.axis("date", {
          label: {
            textStyle: {
              fill: "#aaaaaa"
            }
          }
        });
        that.chart.axis("value", {
          label: {
            textStyle: {
              fill: "#aaaaaa"
            },
            formatter: function formatter(text) {
              return text.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
            }
          }
        });
        that.chart
          .lineStack()
          .position("date*value")
          .color("country")
        that.chart
          .areaStack()
          .position("date*value")
          .color("country")
          .opacity(0.3);
      }

      function chartType2() {
        that.chart.axis("date", {
          label: {
            textStyle: {
              fill: "#aaaaaa"
            }
          }
        });
        that.chart.axis("percent", {
          label: {
            textStyle: {
              fill: "#aaaaaa"
            }
          }
        });
        that.chart
          .lineStack()
          .position("date*percent")
          .color("country");
        that.chart
          .areaStack()
          .position("date*percent")
          .color("country")
          .opacity(0.3);
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>