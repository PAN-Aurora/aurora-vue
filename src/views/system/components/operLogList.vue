<template>
     <div>
          <!--查询开始-->
        <a-card title="查询条件" hoverable size="default" style="margin-top:0.5em;margin-bottom:0.5em" >
            <a-row type="flex" justify="center" style="margin-bottom: 10px;">
                <a-col :span="4">
                    <label class="dark_query_font">模块名称：</label>
                    <a-input placeholder="模块名称" v-model="filter.logModule" style="width: 50%"></a-input>
                </a-col>
                <a-col :span="4">
                    <label class="dark_query_font">登录用户：</label>
                    <a-input placeholder="登录用户" v-model="filter.logUser" style="width: 50%"></a-input>
                </a-col>
                <a-col :span="4" >
                        <label class="dark_query_font">日志类型：</label>
                        <a-select style="width:60%;" placeholder="日志类型"  
                           v-model="filter.logType">
                            <a-select-option value="1">操作日志</a-select-option>
                            <a-select-option value="2">异常日志</a-select-option>
                        </a-select>
                </a-col>
                <a-col :span="4">
                    <label class="dark_query_font">开始时间：</label>
                    <a-date-picker placeholder="操作开始时间" showTime v-model="filter.startTime" style="width:50%"></a-date-picker>
                </a-col>
                <a-col :span="4">
                    <label class="dark_query_font">结束时间：</label>
                    <a-date-picker placeholder="操作结束时间" showTime v-model="filter.endTime" style="width: 50%"></a-date-picker>
                </a-col>
                <a-col :span="4">
                    <a-button type="primary" icon="search" style="margin-right: 10px" size="default" @click="queryFromBtn" title="查询">查询</a-button>
                    <a-button type="primary" icon="sync" size="default" @click="resetFilter" title="重置">重置</a-button>
                </a-col>            
            </a-row>
        </a-card>
          <!--查询结束-->

        <a-row type="flex" justify="space-around">
            <a-col :span="24">
                <a-table
                  :rowKey="tableRowKey"
                  :columns="columns"
                  :dataSource="logList"
                  :pagination="pagination"
                  @change="tableChange"
                  :loading="loading"
                   bordered
                  >
                   <span slot="logTypeFilter" slot-scope="text">
                                {{text|logTypeFilter}}
                    </span>
                  </a-table>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import {GET} from '@/utils/restful_util';
import moment from 'moment';
export default {
    name: 'operLogList',
    props: {
        columns: Array,
        queryType: String,
        url: String,
        tableRowKey: String
    },
    data() {
        return {
            filter: {},
            currentFilter: {},
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                size: 'small',
                pageSizeOptions: ['10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条"
                },
                  showSizeChanger: true,
            },
            logList: [],
            loading: false, // table加载效果状态位
        }
    },
    methods: {
        // 清空查询条件
        resetFilter() { 
            this.filter = {};
            this.currentFilter={};
            this.orgArr = [];
            this.pagination.current = 1;
            this.pagination.pageSize = 10;
            this.pagination.total = 0;
            this.getDataSource();
        },
        // 调用日志查询接口，查询日志列表，接收返回数据
        getDataSource() { 
            this.loading = true;
            this.currentFilter.start = this.pagination.current;
            this.currentFilter.limit = this.pagination.pageSize;
            GET(this,this.url,this.currentFilter, res => {
                if(res.code && res.code == '200') {
                    this.logList = res.data.list;
                    this.pagination.total = res.data.count;
                    this.loading = false;
                }else{
                    this.$message.error(res.message);
                    this.loading = false;
                }
            })
        },
         // 通过按钮手动调用查询接口
        queryFromBtn() {
            this.currentFilter = {}; // 清除正在使用的查询条件
            this.currentFilter = Object.assign(this.currentFilter,this.filter); // 覆盖查询条件
            this.currentFilter.startTime = this.currentFilter.startTime ? moment(this.currentFilter.startTime).format('YYYY-MM-DD HH:mm:ss') : '';
            this.currentFilter.endTime = this.currentFilter.endTime ? moment(this.currentFilter.endTime).format('YYYY-MM-DD HH:mm:ss') : '';
            this.pagination.current = 1; // 从第一页开始
            this.getDataSource();
        },
        tableChange(pagination) { // table分页查询
            Object.assign(this.pagination, pagination);
            this.getDataSource();
        },
    },
    filters: {
        logTypeFilter: (text) => {
            switch(text) {
                case 1:
                    return '操作日志';
                case 2:
                    return '异常日志';
                default:
                    return '';
            }
        }
    },
    mounted() {
        this.getDataSource();
    },
    created() {
    }
}
</script>