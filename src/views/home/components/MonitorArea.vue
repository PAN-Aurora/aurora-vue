<template>
  <div>
    <div style="position: relative;width:100%;height:100%;">
      <el-amap
        class="amap-box"
        :zoom="zoom"
        :mapStyle="mapStyle"
        :vid="'amap-vue'"
        :map-manager="AMapManager"
        :events="events"
        style="height:0;margin-bottom:-120px"
      ></el-amap>
      <div id="province"></div>
    </div>
  </div>
</template>

<script>
import { AMapManager } from "vue-amap";
import DataSet from "@antv/data-set";
import _ from "lodash";
export default {
  name: "monitor-area",
  data() {
    return {
      mapStyle: "amap://styles/bbb5de3e7a002d412b19f47e57f3d615",
      zoom: 4,
      center: [121.59996, 31.197646],
      AMapManager,
      events: {
        init(map) {
          AMapUI.loadUI(["geo/DistrictExplorer"], function(DistrictExplorer) {
            const adcodes = {
              "110000": "北京市",
              "120000": "天津市",
              "130000": "河北省",
              "140000": "山西省",
              "150000": "内蒙古自治区",
              "210000": "辽宁省",
              "220000": "吉林省",
              "230000": "黑龙江省",
              "310000": "上海市",
              "320000": "江苏省",
              "330000": "浙江省",
              "340000": "安徽省",
              "350000": "福建省",
              "360000": "江西省",
              "370000": "山东省",
              "410000": "河南省",
              "420000": "湖北省",
              "430000": "湖南省",
              "440000": "广东省",
              "450000": "广西壮族自治区",
              "460000": "海南省",
              "500000": "重庆市",
              "510000": "四川省",
              "520000": "贵州省",
              "530000": "云南省",
              "540000": "西藏自治区",
              "610000": "陕西省",
              "620000": "甘肃省",
              "630000": "青海省",
              "640000": "宁夏回族自治区",
              "650000": "新疆维吾尔自治区",
              "710000": "台湾省",
              "810000": "香港特别行政区",
              "820000": "澳门特别行政区"
            };
            console.log(adcodes);
            var colors = [
              "#3366cc",
              "#dc3912",
              "#ff9900",
              "#109618",
              "#990099",
              "#0099c6",
              "#dd4477",
              "#66aa00",
              "#b82e2e",
              "#316395",
              "#994499",
              "#22aa99",
              "#aaaa11",
              "#6633cc",
              "#e67300",
              "#8b0707",
              "#651067",
              "#329262",
              "#5574a6",
              "#3b3eac"
            ];
            // 当前聚焦的区域
            var currentAreaNode = void 0;
            // 创建一个实例
            const districtExplorer = new DistrictExplorer({
              eventSupport: true, //打开事件支持
              map: map
            });

            districtExplorer.on("featureClick", (e, feature) => {
              console.log(e, feature);
              var props = feature.properties;
              //如果存在子节点
              console.log(props.adcode);
              if (props.childrenNum > 0) {
                //切换聚焦区域
                switch2AreaNode(props.adcode);
              }
            });

            // 外部区域被点击
            districtExplorer.on("outsideClick", e => {
              districtExplorer.locatePosition(
                e.originalEvent.lnglat,
                (error, routeFeatures) => {
                  console.log(error, routeFeatures);
                  if (routeFeatures && routeFeatures.length > 1) {
                    //切换到省级区域
                    switch2AreaNode(routeFeatures[1].properties.adcode);
                  } else {
                    //切换到全国
                    switch2AreaNode(100000);
                  }
                },
                {
                  evelLimit: 2
                }
              );
            });

            // 绘制某个区域的边界
            function renderAreaPolygons(areaNode) {
              var node = _.cloneDeep(areaNode);
              districtExplorer.clearFeaturePolygons();
              districtExplorer.renderSubFeatures(node, function(feature, i) {
                var fillColor = colors[i % colors.length];
                var strokeColor =
                  colors[colors.length - 1 - (i % colors.length)];

                return {
                  cursor: "default",
                  bubble: true,
                  strokeColor: strokeColor, //线颜色
                  strokeOpacity: 1, //线透明度
                  strokeWeight: 1, //线宽
                  fillColor: fillColor, //填充色
                  fillOpacity: 0.35 //填充透明度
                };
              });

              //绘制父区域
              districtExplorer.renderParentFeature(node, {
                cursor: "default",
                bubble: true,
                strokeColor: "black", //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 1, //线宽
                fillColor: null, //填充色
                fillOpacity: 0.35 //填充透明度
              });
            }

            //切换区域后刷新显示内容
            function refreshAreaNode(areaNode) {
              districtExplorer.setHoverFeature(null);
              renderAreaPolygons(areaNode);
            }

            //切换区域
            function switch2AreaNode(adcode, callback) {
              if (
                currentAreaNode &&
                "" + currentAreaNode.getAdcode() === "" + adcode
              ) {
                return;
              }

              loadAreaNode(adcode, function(error, areaNode) {
                if (error) {
                  if (callback) {
                    callback(error);
                  }
                  return;
                }
                currentAreaNode = window.currentAreaNode = areaNode;
                refreshAreaNode(areaNode);
                if (callback) {
                  callback(null, areaNode);
                }
              });
            }

            // 加载区域
            function loadAreaNode(adcode, callback) {
              districtExplorer.loadAreaNode(adcode, (error, areaNode) => {
                if (error) {
                  if (callback) {
                    callback(error);
                  }
                  return;
                }
                renderG2Map(areaNode); // 使用 G2 绘制地图

                if (callback) {
                  callback(null, areaNode);
                }
              });
            }

            // 全国
            switch2AreaNode(100000);

            // 开始使用 G2 绘制地图
            var provinceChart = void 0;

            function renderG2Map(areaNode) {
              var adcode = areaNode.getAdcode();
              var geoJSON = areaNode.getSubFeatures(); // 获取 geoJSON 数据
              var name = areaNode.getName();

              provinceChart && provinceChart.destroy();
              provinceChart = null;
              if (
                !geoJSON ||
                (currentAreaNode &&
                  "" + currentAreaNode.getAdcode() === "" + adcode)
              ) {
                return;
              }
              var dv = processData(geoJSON);
              provinceChart = new G2.Chart({
                container: "province",
                forceFit: true,
                width: "800",
                height: "750",
                padding: 0
              });
              provinceChart.on("plotclick", ev => {
                if (ev.data) {
                  for (let item in adcodes) {
                    if (ev.data._origin.name === adcodes[item]) {
                      switch2AreaNode(item);
                    }
                  }
                } else {
                  switch2AreaNode(100000);
                }
              });
              provinceChart.source(dv);
              provinceChart.axis(false);
              provinceChart.tooltip({
                showTitle: false
              });
              provinceChart
                .polygon()
                .position("longitude*latitude")
                .label("name", {
                  textStyle: {
                    fill: "#fff",
                    fontSize: 10,
                    shadowBlur: 2,
                    shadowColor: "rgba(0, 0, 0, .45)"
                  }
                })
                .style({
                  stroke: "#fff",
                  lineWidth: 1
                })
                .color("value", "#BAE7FF-#1890FF-#0050B3");
              provinceChart.guide().text({
                position: ["min", "max"],
                offsetY: 20,
                content: name,
                style: {
                  fontSize: 14,
                  fontWeight: "bold"
                }
              });
              provinceChart.render();
            }

            function processData(geoJSON) {
              var mapData = {
                type: "FeatureCollection",
                features: geoJSON
              };
              // 构造虚拟数据
              var userData = [];
              for (var i = 0; i < geoJSON.length; i++) {
                var name = geoJSON[i].properties.name;
                userData.push({
                  name: name,
                  value: Math.round(Math.random() * 1000)
                });
              }
              var ds = new DataSet();
              var geoDataView = ds.createView().source(mapData, {
                type: "GeoJSON"
              }); // geoJSON 经纬度数据

              // 用户数据
              var dvData = ds.createView().source(userData);
              dvData.transform({
                type: "geo.region",
                field: "name",
                geoDataView: geoDataView,
                as: ["longitude", "latitude"]
              });

              return dvData;
            }
          });
        }
      }
    };
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.amap-wrapper {
  width: 500px;
  height: 500px;
}
</style>