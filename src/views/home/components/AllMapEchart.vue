<template>
    <div ref="map" style="height:100%">
    </div>
</template>

<script>
    import china from 'echarts/map/json/china.json'
    import { getChinaGeoCoordMap,getManaAreaData }from "../../../utils/dataManager/map_util";
    export default {
        name: "AllMapEchart",
        props: {
            geoCoordMap: {
                type: Object,
            default: () => {
                    let geo =  {
                        '二级监测点':[114.48,38.03],
                        '三级监测点':[117.93,40.97]
                    };
                    return geo;
                }
        },
        geoData: {
            type: Array,
            default: () => {
                    let geoData =  [
                        {name: '二级监测点', value: 300,id:'11'},
                        {name: '三级监测点', value: 300,id:'12'}
                    ];
                    return geoData;
                }
        }
    },
    data() {
        return {
            mapEchart:null,
            localGeoMap:[],
            localGeoData:[],
            chinaGeoCoord:{},
            chinaDatas:[],
        };
    },
    methods: {

        init(geoMap,geoData) {
            let _this = this;
            //加载地图点坐标解析
            getChinaGeoCoordMap(_this,geoData);
            //加载区域数据
            getManaAreaData(_this,geoData);

            _this.mapEchart = _this.$echarts.init(_this.$refs["map"]);
            _this.$echarts.registerMap('china', china);

            let  geoCoordMap = geoMap;
            let  data = geoData;

            _this.localGeoMap = geoMap;
            _this.localGeoData = geoData;
            //转换数据
            let convertData = function (data) {
                let res = [];
                for (let i = 0; i < data.length; i++) {
                    let geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value),
                            id:data[i].id
                        });
                    }
                }
                return res;
            };

            //图表对象
            let option = {
                //backgroundColor: '#020933',
                title: {
                    show:false,
                    top:20,
                    text: '全国监测中心分布',
                    subtext: '',
                    x: 'center',
                    textStyle: {
                        color: '#ccc'
                    }
                },

                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        //   if(typeof(params.value)[2] == "undefined"){
                        //   	return params.name + ' : ' + params.value;
                        //   }else{
                        //   	return params.name + ' : ' + params.value[2];
                        //   }
                        return params.name;
                    }
                },
                legend: { //图标
                    orient: 'vertical',
                    y: 'bottom',
                    x:'right',
                    data:['pm2.5'],
                    textStyle: {
                        color: '#fff'
                    }
                },
                visualMap: {
                    show: false,
                    min: 0,
                    max: 500,
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'], // 文本，默认为数值文本
                    calculable: true,
                    seriesIndex: [1],
                    inRange: {
                        // color: ['#3B5077', '#031525'] // 蓝黑
                        // color: ['#ffc0cb', '#800080'] // 红紫
                        // color: ['#3C3B3F', '#605C3C'] // 黑绿
                        //color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
                        //color: ['#23074d', '#cc5333'] // 紫红
                        // color: ['#00467F', '#A5CC82'] // 蓝绿
                        // color: ['#1488CC', '#2B32B2'] // 浅蓝
                        // color: ['#00467F', '#A5CC82'] // 蓝绿
                        // color: ['#00467F', '#A5CC82'] // 蓝绿
                        // color: ['#00467F', '#A5CC82'] // 蓝绿
                        // color: ['#00467F', '#A5CC82'] // 蓝绿

                    }
                },
                toolbox: {
                    show: false,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                geo: {
                    show: true,
                    map: 'china',
                    zoom: 1.2, //地图大小
                    label: { //字体颜色
                        normal: {
                            color:'#bac0c0',
                            show: true,
                            fontSize:10
                        },
                        emphasis: {
                            show: false,
                        }
                    },
                    roam: true,
                    itemStyle: {
                        normal: {
                            areaColor: 'transparent',
                            // borderColor: '#3fdaff',//地图边框颜色
                            borderColor: '#5868D9',
                            borderWidth: 1,
                            shadowColor: 'rgba(63, 218, 255, 0.5)',
                            shadowBlur: 30
                        },
                        emphasis: {
                            areaColor: '#2B91B7',
                        }
                    }
                },
                series : [
                    {
                        name: '涟漪特效散点图',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: convertData(data),
                        symbolSize: function (val) { //涟漪大小
                            return val[2] / 10;
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: false   //显示文字
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#F4E925',
                                shadowBlur: 10,
                                shadowColor: '#05C3F9'
                            }
                        },
                        zlevel: 1
                    },

                ]
            };
            _this.mapEchart.setOption(option);
     
            //单击进入每个分中心 
            _this.mapEchart.on('click', function (params) {
                if(params.componentSubType=="effectScatter"){
                    _this.mapEchart.dispose();
                    _this.changeInitMap(params.data);

                }else if(params.componentType=="geo"){
                       _this.mapEchart.dispose();
                       _this.init(_this.localGeoMap, _this.localGeoData); 
                }

            });
         
        },
        //地图切换
        changeInitMap(params){
            let _this = this
            _this.mapEchart = _this.$echarts.init(_this.$refs["map"]);
            _this.$echarts.registerMap('china', china);

            let chinaGeoCoordMap = _this.chinaGeoCoord;
            //下级管理区域
            let chinaDatas = _this.chinaDatas[params.name];

            let convertData = function(data) {
                let res = [];
                for(let i = 0; i < data.length; i++) {
                    let dataItem = data[i];
                    let fromCoord = chinaGeoCoordMap[dataItem[0].name];
                    let toCoord = _this.chinaGeoCoord[params.name];
                    if(fromCoord && toCoord) {
                        res.push([{
                            coord: toCoord,
                        },{
                            coord: fromCoord,
                            value: dataItem[0].value
                        }
                        ]);
                    }
                }
                return res;
            };
            let series = [];
            [[params.name, chinaDatas]].forEach(function(item, i) {
                series.push({
                        type: 'lines',
                        zlevel: 2,
                        effect: {
                            show: true,
                            period: 4, //箭头指向速度，值越小速度越快
                            trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                            symbol: 'arrow', //箭头图标
                            symbolSize: 5, //图标大小
                        },
                        lineStyle: {
                            normal: {
                                width: 1, //尾迹线条宽度
                                opacity: 1, //尾迹线条透明度
                                curveness: .3 //尾迹线条曲直度
                            }
                        },
                        data: convertData(item[1])
                    }, {
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        zlevel: 2,
                        rippleEffect: { //涟漪特效
                            period: 4, //动画时间，值越小速度越快
                            brushType: 'stroke', //波纹绘制方式 stroke, fill
                            scale: 4 //波纹圆环最大限制，值越大波纹越大
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'right', //显示位置
                                offset: [5, 0], //偏移设置
                                formatter: function(params){//圆环显示文字
                                    return params.data.name;
                                },
                                fontSize: 13
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        symbol: 'circle',
                        symbolSize: function(val) {
                            return 5+ val[2] * 5; //圆环大小
                        },
                        itemStyle: {
                            normal: {
                                show: false,
                                color: '#f00'
                            }
                        },
                        data: item[1].map(function(dataItem) {
                            return {
                                name: dataItem[0].name,
                                value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                            };
                        }),
                    },
                    //被攻击点
                    {
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        zlevel: 2,
                        rippleEffect: {
                            period: 4,
                            brushType: 'stroke',
                            scale: 4
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                //offset:[5, 0],
                               // color: '#0f0',
                                formatter: '{b}',
                                textStyle: {
                                    color: "#F4E925"
                                }
                            },
                            emphasis: {
                                show: true,
                                color: "#F4E925"
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#F4E925'
                            }
                        },
                        symbol: 'pin',
                        symbolSize: 20,
                        data: [{
                            name: item[0],
                            value: chinaGeoCoordMap[item[0]].concat([10]),
                        }],
                    }
                );
            });

            let  option = {
                tooltip: {
                    trigger: 'item',
                    //backgroundColor: 'rgba(166, 200, 76, 0.82)',
                    borderColor: '#FFFFCC',
                    showDelay: 0,
                    hideDelay: 0,
                    enterable: true,
                    transitionDuration: 0,
                    extraCssText: 'z-index:100',
                    formatter: function(params, ticket, callback) {
                        //根据业务自己拓展要显示的内容
                        let res = "";
                        let name = params.name;
                        let value = params.value[params.seriesIndex + 1];
                        res = "<span style='color:#fff;'>" + name + "</span><br/>" ;
                        return res;
                    }
                },
               // backgroundColor:"#013954",
                visualMap: { //图例值控制
                    min: 0,
                    max: 1,
                    calculable: true,
                    show: false,
                    color: ['#f44336', '#fc9700', '#ffde00', '#ffde00', '#00eaff'],
                    textStyle: {
                        color: '#fff'
                    }
                },
                geo: {
                    map: 'china',
                    zoom: 1.4,
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: true, //是否允许缩放
                    itemStyle: {
                        normal: {
                            color: 'rgba(51, 69, 89, 0.5)', //地图背景色
                            borderColor: '#516a89', //省市边界线00fcff 516a89
                            borderWidth: 1
                        },
                        emphasis: {
                            color: 'rgba(37, 43, 61, .5)' //悬浮背景
                        }
                    }
                },
                series: series
            };

            _this.mapEchart.setOption(option);

              //单击进入每个分中心 
            _this.mapEchart.on('click', function (params) {
                if(params.componentSubType=="effectScatter"){
                    _this.mapEchart.dispose();
                    _this.changeInitMap(params.data);

                }else if(params.componentType=="geo"){
                       _this.mapEchart.dispose();
                       _this.init(_this.localGeoMap, _this.localGeoData); 
                }

            });
        }
    },
    mounted() {
        //this.init();
    }
    }
</script>

<style scoped>

</style>