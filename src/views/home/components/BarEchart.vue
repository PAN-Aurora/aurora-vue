<template>
    <div style="width:100%;height:100%;" ref="barEchart">
    </div>
</template>

<script>
    export default {
        name: "BarEchart",
        props: {
            echartData: {
                type: Object,
                default: () => {
                    let data =  { };
                    return data;
                }
            }
        },
        data() {
            return {

            };
        },
        methods: {
            init(echartData) {
                this.barEchart = this.$echarts.init(this.$refs["barEchart"]);
                //新增直播节目和直播违规节目的柱状图
                let  seriesName = echartData.seriesName;
                let  xAxisData =  echartData.xAxisData;
                let  seriesData = echartData.seriesData;

                let option = {
                    title : {
                        show:false,
                        // text: '新增直播节目统计柱状图',
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        show:false,
                        // data: ['新增数']
                    },
                    toolbox: {
                        show : false,
                        feature : {
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [

                        {
                            type : 'category',
                            data : xAxisData,
                            splitLine:{show: false},//去除网格线
                            splitArea : {show : false},//保留网格区域
                            axisLabel: { //y轴标签的颜色
                                interval:0,
                               // rotate:30,
                                rotate:0,
                                textStyle: {
                                    color: '#bac0c0'
                                }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            splitLine:{show: false},//去除网格线
                            splitArea : {show : false},//保留网格区域
                            axisLabel: { //y轴标签的颜色
                                textStyle: {
                                    color: '#bac0c0'
                                }
                            }
                        }
                    ],
                    series : [
                        {
                            name:seriesName,
                            type:'bar',
                            itemStyle: {

                                normal: {
                                    label:{
                                        show:true,
                                        position: 'top', //在上方显示
                                        textStyle:{
                                            color: "#bac0c0",
                                            fontSize: 12
                                        }
                                    },
                                    color: new this.$echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#83bff6'},
                                            //{offset: 0.5, color: '#188df0'},
                                            {offset: 1, color: '#188df0'}
                                        ]
                                    )
                                },
                                emphasis: {
                                    color: new this.$echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#2378f7'},
                                            //{offset: 0.7, color: '#2378f7'},
                                            {offset: 1, color: '#83bff6'}
                                        ]
                                    )
                                }
                            },
                            data:seriesData,
                            /* markPoint : {
                               data : [
                                 {type : 'max', name: '最大值'},
                                 {type : 'min', name: '最小值'}
                               ]
                             },*/
                            /*markLine : {
                              data : [
                                {type : 'average', name: '平均值'}
                              ]
                            }*/
                        }
                    ]
                };
                this.barEchart.setOption(option);
            }
        },
        mounted() {
            //this.init();
        }
    }
</script>

<style scoped>

</style>