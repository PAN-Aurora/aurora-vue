<template>
    <div style="margin:0 auto;">
        <!--模块路径开始-->
        <a-breadcrumb>
            <a-breadcrumb-item> <a-icon type="home" /></a-breadcrumb-item>
            <a-breadcrumb-item><a href="javascript:void(0);">基础数据</a></a-breadcrumb-item>
            <a-breadcrumb-item><a href="javascript:void(0);" >文件库管理</a></a-breadcrumb-item>
        </a-breadcrumb>
        <!--模块路径结束-->

        <!--查询开始-->
        <a-card title="查询条件" hoverable size="default" style="margin-top:0.5em" >
            <a-col :span="24" v-if="true">
                <a-row type="flex" justify="center" style="margin:0.5rem;">
                    <a-col :span="6">
                        <label>文件名称：</label>
                        <a-input v-model="filter.fileName" style="width: 60% ;" placeholder="请输入文件名称"></a-input>
                    </a-col>
                    <a-col :span="6">
                        <label>文件类别：</label>
                        <a-select
                                style="width: 60%"
                                v-model="filter.fileType"
                        >
                            <a-select-option value="" >全部</a-select-option>
                            <a-select-option value="国内" >国内</a-select-option>
                            <a-select-option value="国外" >国外</a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="5">
                        <a-button
                                class="operateBtn"
                                type="primary"
                                :size="size"
                                title="搜索"
                                icon="search"
                                @click="searchResult"
                        >查询</a-button>
                        <a-button
                                class="operateBtn"
                                type="primary"
                                :size="size"
                                title="重置"
                                icon="sync"
                                @click="reset"
                        >重置</a-button>
                    </a-col>
                </a-row>
            </a-col>

        </a-card>
        <!--查询结束-->

        <!--列表开始-->
        <a-card  hoverable size="default" style="margin-top:0.5em" >
            <a-row style="margin:1em auto;" >
                <a-button
                        class="operateBtn"
                        type="primary"
                        icon="plus"
                        :size="size"
                        title="增加"
                        v-hasPermission="'user_add'"
                        @click="handleAdd"
                        v-if="isRender('add')"
                >新增</a-button>
                <a-button
                        class="operateBtn warning"
                        icon="delete"
                        @click="batchDelete"
                        :size="size"
                        title="删除选中条目"
                        v-hasPermission="'user_delete'"
                        v-if="isRender('deleteBatch')"
                >删除</a-button>
            </a-row>

            <a-table
                    bordered
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    @change="tableChange"
                    :dataSource="dataSource"
                    :columns="columns"
                    :pagination="ipagination"
                    :rowKey="(item, index) => { return index }"
            >
                 <span slot="num" slot-scope="text, record, index">
                    {{(ipagination.current-1)*ipagination.pageSize+parseInt(index)+1}}
                 </span>
                <template slot="operation" slot-scope="text, record">
                    <a-button
                            title="编辑"
                            type="primary"
                            @click="handleEdit(record)"
                            icon="edit"
                            shape="circle"
                            v-hasPermission="'user_update'"
                            size="small"
                            v-if="isRender('edit')"
                    ></a-button>
                    <a-popconfirm v-if="isRender('delete')" title="确认删除?" @confirm="() => onDelete(record)">
                        <a-button class="operateBtn warning" type="primary"  shape="circle" icon="delete" size="small" title="删除"></a-button>
                    </a-popconfirm>
                </template>
            </a-table>
            <!--列表结束-->
        </a-card>

        <a-modal
                :title="title"
                v-model="visible"
                :mask="false"
                :centered="true"
                :maskClosable="false"
                :closable="true"
                 :afterClose="searchResult"
                 width="40%"
                :footer="null"
        >
            <file-lib-add :is-edit="isEdit"></file-lib-add>
        </a-modal>

    </div>
</template>
<script>
    import {POST,GET} from '@/utils/restful_util'
    import { listMixin } from "@/maxin/listMixin";
    import { warning,info} from "@/utils/alert_util";
    import moment from "moment";
    import fileLibAdd  from  './file-lib-add';
    export default {
        mixins: [listMixin],
        computed: {
            formColumns: function() {
                let array = this.gridOption.columns.filter(col => {
                    return col.editFlag !== false;
                });
                return array;
            }
        },
        data () {
            return {
                disabled:false,
                visible: false,
                title: "新增",
                size: "default",
                form: this.$form.createForm(this),
                editItem: {},
                columns: [],
                roleList:[],
                isEdit: false,
                filter:{
                    fileType:'',
                    fileName:''
                },
                gridOption: {
                    beforeSubmitType:"post",
                    beforeSubmit:(values,item)=>{
                        values.role = {
                            id: values.role
                        }
                        return values;
                    },
                    gridFilter:{
                    },
                    beforeLoadType:"get",
                    url:{
                        list:"/api/filelib/getFileLibList",
                        delete:"/api/filelib/deleteFileLibById",
                    },
                    columns: [
                        {
                            title: '序号',
                            width: '8%',
                            align: 'center',
                            ellipsis: true,
                            scopedSlots: {customRender: 'num'},
                        },
                        {
                            title: '文档编号',
                            dataIndex: 'fileNo',
                            align: 'center',
                        },
                        {
                            title: '文档名称',
                            dataIndex: 'fileName',
                            ellipsis: true,
                            align: 'center',
                        },
                        {
                            title: '文档类别',
                            dataIndex: 'fileCategory',
                            align: 'center',
                        },
                        {
                            title: '文档类型',
                            dataIndex: 'fileType',
                            align: 'center',
                        },
                        {
                            title: '文档版本',
                            dataIndex: 'fileVersion',
                            align: 'center',
                        },
                        {
                            title: '文档描述',
                            dataIndex: 'fileDesc',
                            ellipsis: true,
                            align: 'center',
                        }
                    ],

                },
            }
        },
        methods: {
            moment,
            modeFormat(item) {
                if (item.multiple) {
                    return "multiple";
                } else {
                    return "";
                }
            },
            searchResult() {
                this.loadData(this.filter);
            },
            //重置
            reset(){
                let _this = this;
                if(_this.filter){
                    Object.keys(_this.filter).forEach(function(key){
                        _this.filter[key] = "";
                    });
                }
                this.ipagination.current = 1;
                this.ipagination.pageSize = 20;
                this.searchResult();
            },
            tableChange(pagination) {
                Object.assign(this.ipagination,pagination);
                this.loadData(this.filter);
            },
            //新增
            handleAdd() {
                this.form.resetFields();
                this.$emit("resetForm");
                this.title = "新增文件";
                this.visible = true;
                this.editItem = {};

                this.$nextTick(() => {
                    if (this.gridOption.beforeAdd) {
                        this.gridOption.beforeAdd();
                    }
                });
                this.disabled = false;
            },
            //编辑
            handleEdit(record) {
                this.editItem = record;
                this.title = "编辑用户";
                this.visible = true;
                let clone = _.cloneDeep(record);
                this.gridOption.columns.forEach(col => {
                    if (["datetimePicker", "datePicker"].indexOf(col.type) > -1) {
                        clone[col.dataIndex] = clone[col.dataIndex]
                            ? moment(new Date(clone[col.dataIndex]))
                            : null;
                    }
                });
                this.$nextTick(() => {
                    if (this.gridOption.beforeEdit) {
                        this.gridOption.beforeEdit(clone);
                    }
                    // carrynie 去除多余属性
                    let obj = this.form.getFieldsValue();
                    for(let key in obj){
                        if(clone.hasOwnProperty(key)){
                            obj[key] = clone[key]
                        }
                    }
                    obj.password ='';
                    obj.role = obj.role.id;

                    // carrynie 去除多余属性
                    this.form.setFieldsValue(obj);
                    this.disabled = true;
                });
            },
            batchDelete() {
                if (this.selectedRowKeys.length === 0) {
                    warning(this, "请选择删除的条目！");
                } else {
                    let ids = [];
                    this.selectedRowKeys.forEach(num => {
                        ids.push(this.dataSource[num].fileId);
                    });
                    this.handleDelete(ids);
                    this.selectedRowKeys=[];
                }
            },
            isRender(btnType) {
                let flag = true;
                if (this.gridOption.btnOperation) {
                    flag = this.gridOption.btnOperation[btnType] === false ? false : true;
                }
                return flag;
            },
            onDelete(record) {
                this.handleDelete([record.fileId]);
                this.selectedRowKeys=[];
            },
            onSelectChange(selectedRowKeys, rows) {
                let selectedItem = {}
                if (this.gridOption.singleColumn === true) {
                    this.selectedRowKeys = [selectedRowKeys.pop()];
                    selectedItem = rows.pop()
                    this.$emit('selected', selectedItem)
                } else {
                    this.selectedRowKeys = selectedRowKeys;
                }
            },
            bindEvent(item, type) {
                if (item[type]) {
                    this.$nextTick(() => {
                        let val = this.form.getFieldValue(item.dataIndex);
                        return item[type](val);
                    });
                } else {
                    return function() {};
                }
            },
            ok() {
                this.$refs["transfer"].$el.click();
            },
            cancel() {
                this.visible = false;
            },
            getResponseData() {
                return _.cloneDeep(this.response);
            },
            async getRoles () {
                let params ={
                    current:1,
                    limit:10000
                }
                GET(this, '/api/role/getRoleList', params, (res) => {
                    let proColumn = this.gridOption.columns[4]
                    if (res.code === 200) {
                        this.roleList = res.data.list.map((role) => {
                            return {
                                label: role.name,
                                value: role.id
                            }
                        })
                        proColumn.options = this.roleList
                    }
                })
            }
        },
        created (){
            if (this.columns.length == 0) {
                this.columns = _.cloneDeep(this.gridOption.columns);
                //过滤掉不展示的列
                this.columns = _.filter(this.columns, col => {
                    return col.colSpan !== 0;
                });
                let width = 100;

                if (!(this.gridOption.showOperation === false)) {
                    this.columns.push({
                        title: "操作",
                        dataIndex: "operation",
                        align: 'center',
                        width: width,
                        scopedSlots: { customRender: "operation" }
                    });
                }
            }
        },
        mounted(){
            this.getRoles();
        },
        components: {
            fileLibAdd
        }
    }
</script>
<style lang="less" scoped>
    @emHalf: 0.5em;
    @modalBody: 750px;
    .operateBtn {
        margin-left: @emHalf;
    }
    #form {
        max-height: @modalBody;
        overflow-y: auto;
    }
    .mgl {
        margin-left: 1em;
    }

</style>