<template>
       <div>
        <!--模块路径开始-->
        <a-breadcrumb>
            <a-breadcrumb-item> <a-icon type="home" /></a-breadcrumb-item>
            <a-breadcrumb-item><a href="javascript:void(0);">系统管理</a></a-breadcrumb-item>
            <a-breadcrumb-item><a href="javascript:void(0);" >日志管理</a></a-breadcrumb-item>
        </a-breadcrumb>
        <!--模块路径结束-->
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
                            dataIndex: 'logModule'
                        },
                        {
                            title: '用户操作',
                            dataIndex: 'logMothod'
                        }, 
                        {
                            title: '操作URL',
                            dataIndex: 'logUrl'
                        }, 
                        {
                            title: '登录用户',
                            dataIndex: 'logUser'
                        },
                         {
                            title: '用户IP',
                            dataIndex: 'logIp'
                        }, 
                         {
                            title: '日志类型',
                            dataIndex: 'logType',
                            scopedSlots: {customRender: 'logTypeFilter'},
                        }, 
                        
                        {
                            title: '操作时间',
                            dataIndex: 'logCreateTime'
                        }],
                        urls:{
                            operUrl:'/api/log/getLogList'
                        }
                 }
        },
        methods: {
           
        },
        mounted (){
           
        }
    }
</script>