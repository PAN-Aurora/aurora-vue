<template>
    <div style="width:100% ;height:100%" ref="pieEchart">

    </div>
</template>

<script>
    export default {
        name: "PieEchart",
        props:{
            vodAlarmEchartData:{}
        },
        data(){
            return {
                pieEchart:null
            };
        },
        methods:{
            init(vodAlarmEchartData){
                this.pieEchart  =  this.$echarts.init(this.$refs["pieEchart"]);
                let scaleData =vodAlarmEchartData.seriesData;
                let rich = {
                    white: {
                        color: '#ddd',
                        align: 'center',
                        padding: [3, 0]
                    }
                };
                let placeHolderStyle = {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        color: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(0, 0, 0, 0)',
                        borderWidth: 0
                    }
                };
                let data = [];
                let color=['#1a9bfc', '#99da69','#01babc', '#7049f0','#ffa800','#ff5b00','#ff3000']
                for (let i = 0; i < scaleData.length; i++) {
                    data.push({
                        value: scaleData[i].value,
                        name: scaleData[i].name,
                        itemStyle: {
                            normal: {
                                borderWidth: 1,
                                shadowBlur: 100,
                                borderColor:color[i],
                                shadowColor: color[i]
                            }
                        }
                    }, {
                        value: 2,
                        name: '',
                        itemStyle: placeHolderStyle
                    });
                }
                let seriesObj = [{
                    name: '',
                    type: 'pie',
                    clockWise: false,
                    radius: [10, 50],
                    hoverAnimation: false,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                color: '#ddd',
                                formatter: function(params) {
                                    let percent = 0;
                                    let total = 0;
                                    for (let i = 0; i < scaleData.length; i++) {
                                        total += scaleData[i].value;
                                    }
                                    percent = ((params.value / total) * 100).toFixed(0);
                                    if(params.name !== '') {
                                        //return params.name +'('+params.value+')'+ '\n{white|' + '占比' + percent + '%}';
                                        return params.name +'('+params.value+')';

                                    }else {
                                        return '';
                                    }
                                },
                                rich: rich
                            },
                            labelLine: {
                                length:20,
                                length2:20,
                                show: true,
                                color:'#00ffff'
                            }
                        }
                    },
                    data: data
                }];
                let option = {
                       // backgroundColor: '#04243E',
                        tooltip: {
                            show: false
                        },
                        legend: {
                            show: false
                        },
                        toolbox: {
                            show: false
                        },
                        series: seriesObj
        }
                this.pieEchart.setOption(option);
            },
            init1(vodAlarmEchartData){
                this.pieEchart  =  this.$echarts.init(this.$refs["pieEchart"]);
                let option = {
                    title : {
                        show:false,
                        text: '最新点播违规节目统计',
                        subtext: '最新点播违规节目统计',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        show:false,
                        x : 'center',
                        y : 'bottom',
                        data:vodAlarmEchartData.legendData
                    },
                    toolbox: {
                        show : false,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    series : [
                        {
                            name:'点播违规数量',
                            type:'pie',
                            radius : [30, 50],
                            center : ['50%', '50%'],
                            roseType : 'radius',
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            lableLine: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data:vodAlarmEchartData.seriesData
                        }
                    ]
                };
                this.pieEchart.setOption(option);
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>