<template>
   <div>
    <a-divider  style="font-size:18px;color:#c4cbec;font-family:'微软雅黑';">操作日志</a-divider>
            <oper-log-list :columns="operLogColumns" :queryType="'operLog'" :url="urls.operUrl" :tableRowKey="'logId'"></oper-log-list>
    </div>
</template>
<script>
    import operLogList from './components/operLogList'
    export default {
        components: {
            operLogList
        },
        data () {
            return {
                operLogColumns: [
                      {       
                        title: '序号',      
                        width: '5%', 
                        editFlag:false,
                        customRender: (text, record, index) => {
                                return (index+1)
                        }
                    },
                    {
                    title: '模块名称',
                    dataIndex: 'module'
                },{
                    title: '用户操作',
                    dataIndex: 'operate'
                }, 
                {
                    title: '用户名',
                    dataIndex: 'userName'
                }, {
                    title: '用户ip',
                    dataIndex: 'userIp'
                }, {
                    title: '操作时间',
                    dataIndex: 'operateTime'
                }],
                urls:{
                    operUrl:'/iptv_ln/logger.do?method=list'
                }
            }
        },
        methods: {
           
        },
        mounted (){
           
        }
    }
</script>

<style lang="less">
 @import '../../customStyle/dartStyle';
 </style>