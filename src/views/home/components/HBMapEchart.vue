<template>
    <div ref="map" style="height:100%;">

    </div>
</template>

<script>
    import hebei from 'echarts/map/json/province/hebei.json';
    export default {
        name: "HBMapEchart",
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
                mapEchart:null
            };
        },
        methods: {

            init(geoMap,geoData) {
                this.mapEchart = this.$echarts.init(this.$refs["map"]);
                this.$echarts.registerMap('hebei', hebei);
                let  geoCoordMap = geoMap;
                let data = geoData;
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
                        text: '河北全省总端分布',
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
                        map: 'hebei',
                        label: {
                            normal: {
                                color:'#FFF',
                                show: true
                            },
                            emphasis: {
                                show: false,
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: 'transparent',
                                borderColor: '#3fdaff',
                                borderWidth: 2,
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
                            name: 'light',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: convertData(data),
                            symbolSize: function (val) {
                                return val[2] / 10;
                            },
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#F4E925'
                                }
                            }
                        },
                        {
                            type: 'map',
                            map: 'hebei',
                            zoom: 1.2,
                            geoIndex: 0,
                            aspectScale: 0.75, //长宽比
                            showLegendSymbol: false, // 存在legend时显示
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            },
                            roam: true,
                            itemStyle: {
                                normal: {
                                    areaColor: '#031525',
                                    borderColor: '#FFFFFF',
                                },
                                emphasis: {
                                    areaColor: '#2B91B7'
                                }
                            },
                            animation: false,
                            data: data
                        },
                        {
                            name: '涟漪特效散点图',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: convertData(data.sort(function (a, b) {
                                return b.value - a.value;
                            }).slice(0, 5)),
                            symbolSize: function (val) {
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
                                    show: true
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
                this.mapEchart.setOption(option);
                this.mapEchart.on('click', function (params) {
                    if(params.seriesType=='effectScatter'||params.seriesType=="effectScatter"){
                        console.info(params);
                    }

                });
            }
        },
        mounted() {
            //this.init();
        }
    }
</script>

<style lang="less" scoped>

</style>