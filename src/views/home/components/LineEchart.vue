<template>
     <div class="content" style="height:96%;" ref="lineEchart">
    </div>
</template>

<script>
    export default {
        name: "LineEchart",
        props: {
            echartData: null
        },
        data() {
            return {
                areaChart: null
            };
        },
        methods: {
            init(echartData){
                this.areaChart  = this.$echarts.init( this.$refs["lineEchart"]);
                let xData = echartData.xAxisData;

                let color = ['#1a9bfc', '#99da69','#01babc', '#7049f0' ]
                let name = ['一级平台','二级平台','三级平台','六级平台']
                let data = [
                    echartData.seriesData_one,
                    echartData.seriesData_two,
                    echartData.seriesData_three,
                    echartData.seriesData_six,
                ]

                let series = [];
                for (let i = 0; i < 4; i++) {
                    series.push({
                        name: name[i],
                        type: "line",
                        symbolSize: 3,//标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10[ default: 4 ]
                        symbol: 'circle',//标记的图形。ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
                        smooth: true, //是否平滑曲线显示
                        showSymbol: false, //是否显示 symbol, 如果 false 则只有在 tooltip hover 的时候显示
                        areaStyle: {
                            normal: {
                                color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: color[i]
                                }, {
                                    offset: 0.8,
                                    color: 'rgba(255,255,255,0)'
                                }], false),
                                // shadowColor: 'rgba(255,255,255, 0.1)',
                                shadowBlur: 10,
                                opacity:0.3,
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: color[i],
                                lineStyle: {
                                    width: 1,
                                    type: 'solid' //'dotted'虚线 'solid'实线
                                },
                                borderColor: color[i], //图形的描边颜色。支持的格式同 color
                                borderWidth: 8 ,//描边线宽。为 0 时无描边。[ default: 0 ] 
                                barBorderRadius: 0,
                                label: {
                                    show: false,
                                },
                                opacity:0.5,
                            }
                        },
                        data: data[i],

                    })
                }

               let  option = {
                   // backgroundColor: "#141f56",
                    legend: {
                            top: 2,
                            itemGap:5,
                            itemWidth:5,
                            textStyle: {
                                color: '#fff',
                                fontSize: '10'
                            },
                            data: name
                    },
                    title: {
                        show:false,
                        text: "全国数据趋势变化图",
                        textStyle: {
                            color: '#fff',
                            fontSize: '22',
                            fontWeight: 'normal',
                        },
                        subtextStyle: {
                            color: '#90979c',
                            fontSize: '16',

                        },
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
                            lineStyle: {
                                color: '#57617B'
                            }
                        },
                        //formatter: '{b}<br />{a0}: {c0}<br />{a1}: {c1}<br />{a2}: {c2}<br />{a3}: {c3}<br />',
                          formatter: function (params, ticket, callback) {
                            let tooltip = "";
                            params.forEach(item =>{
                                tooltip += item.seriesName+" : "+item.data+"<br />";
                            })
                            return tooltip;
                           
                        },
                        backgroundColor: 'rgba(0,0,0,0.7)', // 背景
                        padding: [8, 10], //内边距
                        extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', //添加阴影
                    },
                    grid: {
                        borderWidth: 0,
                        top: 40, //网格位置
                        bottom: 35,
                        textStyle: {
                            color: "#fff"
                        }
                    },
                    xAxis: [{
                        type: "category",
                        axisLine: {
                            lineStyle: {
                                color: '#32346c'
                            }
                        },
                        splitLine: { //是否显示网格线
                            show: false,
                            lineStyle: {
                                color: '#32346c ',
                            }
                        },
                        boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
                        axisTick: {
                            show: false
                        },
                        splitArea: {
                            show: false
                        },
                        axisLabel: {
                            inside: false,
                            textStyle: {
                                color: '#bac0c0',
                                fontWeight: 'normal',
                                fontSize: '12',
                            },
                        },
                        data: xData,
                    }],
                    yAxis: {
                        type: 'value',
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false, //是否显示y轴网格线
                            lineStyle: {
                                color: '#32346c',
                            }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#32346c ',
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#bac0c0',
                                fontWeight: 'normal',
                                fontSize: '12',
                            },
                            formatter: '{value}',
                        },
                    },
                    series: series,
                  }
                  //设置图表属性
                this.areaChart.setOption(option);
            }


            // init(echartData) {
            //     //数据趋势变化图 直播点播数据
            //     this.areaChart  = this.$echarts.init( this.$refs["lineEchart"]);
            //     //x轴显示数据
            //     this.areaChart.setOption({
            //         title: {
            //             show: false,
            //             text: '数据趋势变化图'
            //         },
            //         tooltip : {
            //             trigger: 'axis',
            //             axisPointer: {
            //                 type: 'cross',
            //                 label: {
            //                     backgroundColor: '#6a7985'
            //                 }
            //             }
            //         },
            //         legend: {
            //             data:['一级平台','二级平台','三级平台','六级平台'],
            //             textStyle: {
            //                 color: '#FFF',
            //             }
            //         },
            //         color: ["#FFD700","#4cd5ce","#FF8C00","#006400"],
            //         toolbox: {
            //             show: false,
            //             feature: {
            //                 saveAsImage: {}
            //             }
            //         },
            //         grid: {
            //             left: '3%',
            //             right: '4%',
            //             bottom: '3%',
            //             containLabel: true
            //         },
            //         xAxis : [
            //             {
            //                 type : 'category',
            //                 boundaryGap : false,
            //                 data : echartData.xAxisData,
            //                 splitLine:{show: false},//去除网格线
            //                 splitArea : {show : false},//保留网格区域
            //                 axisLine: {
            //                     lineStyle: {
            //                         type: 'solid',
            //                         color: '#fff',//左边线的颜色
            //                         width:'1'//坐标线的宽度
            //                     }
            //                 },
            //                 axisLabel: {
            //                     interval:0,
            //                    // rotate: 30,
            //                     rotate: 0,
            //                     textStyle: {
            //                         color: '#fff',//坐标值得具体的颜色

            //                     }
            //                 }
            //             }
            //         ],
            //         yAxis : [
            //             {
            //                 type : 'value',
            //                 splitLine:{show: false},//去除网格线
            //                 splitArea : {show : false},//保留网格区域
            //                 axisLine: {
            //                     lineStyle: {
            //                         type: 'solid',
            //                         color:'#fff',
            //                         width:'1'
            //                     }
            //                 },
            //                 axisLabel: { //y轴标签的颜色
            //                     textStyle: {
            //                         color: '#fff'
            //                     }
            //                 }
            //             }
            //         ],
            //         series : [
            //             {
            //                 name:'一级平台',
            //                 type:'line',
            //                 stack: '总量',
            //                 areaStyle: {
            //                     normal: {
            //                         color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //                             {
            //                                 offset: 1,
            //                                 color: '#FFFFF0'
            //                             },
            //                             {
            //                                 offset: 0,
            //                                 color: '#FFD700'
            //                             }]),
            //                     },
            //                 },
            //                 smooth: true,
            //                 data:echartData.seriesData_one
            //             },
            //             {
            //                 name:'二级平台',
            //                 type:'line',
            //                 stack: '总量',
            //                 smooth: true,
            //                 areaStyle: {
            //                     normal: {
            //                         color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //                             {
            //                                 offset: 1,
            //                                 color: '#FFFFF0'
            //                             },
            //                             {
            //                                 offset: 0,
            //                                 color: '#4cd5ce'
            //                             }]),
            //                     },
            //                 },
            //                 data:echartData.seriesData_two
            //             },
            //             {
            //                 name:'三级平台',
            //                 type:'line',
            //                 stack: '总量',
            //                 smooth: true,
            //                 areaStyle: {
            //                     normal: {
            //                         color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //                             {
            //                                 offset: 1,
            //                                 color: '#FFFFF0'
            //                             },
            //                             {
            //                                 offset: 0,
            //                                 color: '#FF8C00'
            //                             }]),
            //                     },
            //                 },
            //                 data:echartData.seriesData_three
            //             },
            //             {
            //                 name:'六级平台',
            //                 type:'line',
            //                 stack: '总量',
            //                 smooth: true,
            //                 areaStyle: {
            //                     normal: {
            //                         color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //                             {
            //                                 offset: 1,
            //                                 color: '#FFFFF0'
            //                             },
            //                             {
            //                                 offset: 0,
            //                                 color: '#006400'
            //                             }]),
            //                     },
            //                 },
            //                 data:echartData.seriesData_six
            //             }
            //         ]
            //     });
            // }
        }
    }
</script>

<style scoped>

</style>