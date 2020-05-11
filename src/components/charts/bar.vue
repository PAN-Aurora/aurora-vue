<template>
    <div style="width: 100%;height: 100%;position: relative">
        <div class="left-tool-box">
            <a-icon type="align-left" class="sort-button" @click="sortData"/>
        </div>
        <div id="mountNode" style="width: 100%;height: 100%"></div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                data: [{
                    type: '家具家电',
                    value: 34000
                }, {
                    type: '粮油副食',
                    value: 25000
                }, {
                    type: '生鲜水果',
                    value: 11000
                }, {
                    type: '美容洗护',
                    value: 9000
                }, {
                    type: '母婴用品',
                    value: 7000
                }, {
                    type: '进口食品',
                    value: 6000
                }, {
                    type: '食品饮料',
                    value: 4800
                }, {
                    type: '家庭清洁',
                    value: 500
                }],
                sortType: 'positive',
                chart: null,
            }
        },
        methods: {
            initial () {
                document.getElementById('mountNode').innerHTML = ''
                this.chart = new this.$g2.Chart({
                    container: 'mountNode',
                    forceFit: 'true',
                    height: document.getElementById('mountNode').offsetHeight,
                    padding: [20,20,30,90]
                })
                this.chart.source(this.data, {
                    value: {
                        tickCount: 5
                    }
                })
                this.chart.scale('value', {
                    alias: '销售额(万)'
                });
                this.chart.axis('type', {
                    label: {
                        textStyle: {
                            fill: '#aaaaaa'
                        }
                    },
                    tickLine: {
                        alignWithLabel: false,
                        length: 0
                    }
                })
                this.chart.axis('value', {
                    label: {
                        textStyle: {
                            fill: '#aaaaaa'
                        },
                        formatter: function formatter(text) {
                            return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                        }
                    },
                    title: {
                        offset: 70
                    }
                })
                this.chart.guide().dataMarker({
                    top: true,
                    content: '因政策调整导致销量下滑',
                    position: ['2014-01', 1750],
                    style: {
                        text: {
                            fontSize: 13
                        }
                    },
                    lineLength: 30
                })
                this.chart.interval().position('type*value').opacity(1)
                this.chart.render()
            },
            sortData () {
                this.sortType = this.sortType === 'positive' ? 'negative' : 'positive';
                if (this.sortType === 'positive') {
                    this.data.sort(function(a, b) {
                        return b.value - a.value;
                    });
                } else {
                    this.data.sort(function(a, b) {
                        return a.value - b.value;
                    });
                }
                this.chart.repaint();
            }
        },
        mounted () {
            setTimeout(() => {
                this.initial()
            }, 10)
            window.onresize = ()=>{
                this.chart.changeHeight(document.getElementById('mountNode').offsetHeight)
            }
        }
    }
</script>
<style lang="less">
    .left-tool-box{position: absolute; top:0px; left: 0px; width: 40px; height:100%; z-index:1000}
    .left-tool-box .sort-button {width: 70%; height:auto; position: absolute; left:25%; top:30%;}
</style>