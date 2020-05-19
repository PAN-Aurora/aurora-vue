<template>
    <div>
          <!--查询开始-->
        <a-card title="查询条件" hoverable size="default" style="margin-top:0.5em;margin-bottom:0.5em" >
            <a-row type="flex" justify="center" style="margin-bottom: 10px;" v-if="queryType === 'operLog' || queryType === 'errorLog'">
                <a-col :span="4">
                    <label class="dark_query_font">模块名称：</label>
                    <a-input placeholder="任务名称" v-model="filter.logModule" style="width: 50%"></a-input>
                </a-col>
                <a-col :span="4">
                    <label class="dark_query_font">登录用户：</label>
                    <a-input placeholder="操作名称" v-model="filter.logUser" style="width: 50%"></a-input>
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
                  >
                  <template v-if="queryType === 'monitorLog'" slot="monitorType" slot-scope="text">
                      {{text|monitorTypeFilter}}
                  </template>
                  </a-table>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import {GET} from '@/utils/restful_util';
import { org_mixin } from '@/maxin/org_mixin';
import { common_mixin } from '@/maxin/common_mixin';
import moment from 'moment';
export default {
    name: 'operLogList',
    mixins: [org_mixin,common_mixin],
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
            panelDown: false
        }
    },
    methods: {
        resetFilter() { // 清空查询条件
            this.filter = {};
            this.currentFilter={};
            this.orgArr = [];
            this.pagination.current = 1;
            this.pagination.pageSize = 10;
            this.pagination.total = 0;
            this.getDataSource();
        },
        getDataSource() { // 调用日志查询接口，查询日志列表，接收返回数据
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
        queryFromBtn() { // 通过按钮手动调用查询接口
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
        showMoreFilter(){
            this.panelDown = !this.panelDown;
        }
    },
    filters: {
        monitorTypeFilter: (text) => {
            switch(text) {
                case 'live':
                    return '直播';
                case 'vod':
                    return '点播';
                case 'review':
                    return '回看';
                default:
                    return '';
            }
        }
    },
    mounted() {
        this.getDataSource();
    },
    created() {
        if(this.queryType === 'monitorLog') {
            this.orgMount = true;
        }
    }
}
</script>