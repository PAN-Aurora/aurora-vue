<template>
    <div>
          <!--模块路径开始-->
        <a-breadcrumb>
            <a-breadcrumb-item> <a-icon type="home" /></a-breadcrumb-item>
            <a-breadcrumb-item><a href="javascript:void(0);">系统管理</a></a-breadcrumb-item>
            <a-breadcrumb-item><a href="javascript:void(0);" >角色管理</a></a-breadcrumb-item>
        </a-breadcrumb>
          <!--模块路径结束-->
      <!--查询开始-->
        <a-card title="查询条件" hoverable  size="default" style="margin-top:0.5em" >
             <a-col :span="24" v-if="true">
                    <a-row type="flex" justify="center" style="margin:0.5rem;">
                        <a-col :span="5">
                            <label>角色名称：</label>
                            <a-input v-model="filter.name" style="width: 60% ;" placeholder="角色名称"></a-input>
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
    <a-row>
        <a-card  hoverable size="default" style="margin-top:0.5em" >

        <a-table
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                @change="tableChange"
                :dataSource="dataSource"
                :columns="columns"
                 bordered
                :pagination="ipagination"
                :rowKey="(item, index) => { return index }"
          >
          <template slot="title" slot-scope="text, record">
               <a-button
                    class="operateBtn"
                    type="primary"
                    icon="plus"
                    :size="size"
                    title="增加"
                    @click="handleAdd"
                      v-hasPermission="'role_add'"
                    v-if="isRender('add')"
                >新增</a-button>
            <a-button
                    class="operateBtn warning"
                    icon="delete"
                    @click="batchDelete"
                    :size="size"
                      v-hasPermission="'role_update'"
                    title="删除选中条目"
                    v-if="isRender('deleteBatch')"
                >删除</a-button>
            </template>
            <template slot="operation" slot-scope="text, record">
                <a-button
                        title="编辑"
                        type="primary"
                        @click="handleEdit(record)"
                        icon="edit"
                         shape="circle"
                           v-hasPermission="'role_update'"
                        size="small"
                        v-if="isRender('edit')"
                ></a-button>
                <a-popconfirm v-if="isRender('delete')" title="确认删除?" @confirm="() => onDelete(record)">
                      <a-button class="operateBtn warning"   shape="circle" type="primary" icon="delete" size="small" title="删除"></a-button>
                </a-popconfirm>
            </template>
            
        </a-table>
        </a-card>
     </a-row>
        <a-modal
                :title="title"
                v-model="visible"
                :mask="false"
                :centered="true"
                :maskClosable="false"
                :closable="true"
                :width="gridOption.singleCol === true ?  550 : 1000"
                 :footer="null"
                 class="modal_table"
        >
            <a-form
                    :form="form"
                    @submit="handleSubmit"
                    id="form"
                    :style="gridOption.singleCol === true ? {} : {'display': 'flex', 'flex-wrap': 'wrap'}"
            >
                <a-form-item
                        v-for="(item, idx) in formColumns"
                        :style="gridOption.singleCol === true ? {} : {'width': '50%'}"
                        :key="idx"
                        :label="item.title"
                        :label-col="{ span: 5 }"
                        :wrapper-col="{ span: 16, offset: 1 }"
                        layout="vertical"
                >
                     <a-input
                            class="light_input"
                            v-decorator="item.decorator"
                            :disabled="disabled"
                            v-if="item.type == 'input' && item.dataIndex === 'name' "
                            :placeholder="item.placeholder || ''"
                    ></a-input>

                     <a-input
                            class="light_input"
                            v-decorator="item.decorator"
                             v-if="item.type == 'input' &&item.dataIndex != 'name' "
                            :placeholder="item.placeholder || ''"
                    ></a-input>


                </a-form-item>
                <template >
                    <a-card title="权限配置" style="overflow-y: auto;max-height: 400px">
                        <a-tree
                                checkable
                                checkStrictly
                                v-model="checkedKeys"
                                :checkedKeys="checkedKeys"
                                :treeData="treeData"
                                :replaceFields="replaceFields"

                        />
                    </a-card>
              </template>
                <a-form-item :wrapper-col="{ span: 8, offset: 10}">
                    <a-button type="primary" html-type="submit" ref="transfer" style="display: none">提交</a-button>
                </a-form-item>
             </a-form>
            <div  style="text-align: center;">
                 <a-button  @click="cancel" icon="close"  type="primary">取消</a-button>
                 <a-button style="margin-left: 8px"  class="success" icon="save"  @click="ok" type="primary">保存</a-button>
             </div>
        </a-modal>
   
   
    </div>
      
</template>
<script>
    import {POST,GET} from '../../utils/restful_util'
    import { listMixin } from "../../maxin/listMixin";
    import {appRouter} from '../../router/router'
    import { warning,info} from "../../utils/alert_util";
    import moment from "moment";
    import lodash from 'lodash';
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
                checkedKeys: [],
                allCheckedKeys: [],
                treeData:[],
                visible: false,
                title: "新增",
                size: "default",
                form: this.$form.createForm(this),
                editItem: {},
                columns: [],
                replaceFields:{children:'children', title:'title', key:'idKey' },
       
                filter:{
                    name:"",
                },
                gridOption: {
                    beforeSubmitType:"post",
                    beforeAdd: (item) => {
                        this.checkedKeys =[];
                    },
                    beforeEdit: (item) => {
                        this.checkedKeys= [];
                        let  rosourceList =  item.rosourceList;
                        if(item.rosourceList!=null && item.rosourceList.length>0){
                             rosourceList.forEach(item =>{
                                this.checkedKeys.push(item.id);
                        })
                        }else{
                            this.checkedKeys =[];
                        }
                        console.info(this.checkedKeys);
                    },
                    beforeSubmit:(values,item)=>{
                        console.info(this.checkedKeys.checked);
                      if(this.checkedKeys.checked.length>0){
                         let  rosourceList = [];
                         this.checkedKeys.checked.forEach(item =>{
                                rosourceList.push({'id':item});
                          })
                         //权限
                         console.info(rosourceList);
                         values.rosourceList = rosourceList;
                       }
                        values.id = item.id
                        return values;
                    },
                    gridFilter:{
                    },
                    moduleTitle: '角色管理',
                    modelName: 'user',
                    beforeLoadType:"get",
                    url:{
                        list:"/api/role/getRoleList",
                        create: '/api/role/saveRole',
                        update:"/api/role/updateRole",
                        delete:"/api/role/deleteRole",
                    },
                   columns: [
                         {       
                        title: '序号',      
                        width: '8%',
                        editFlag:false,
                        customRender: (text, record, index) => {
                                return (index+1)
                        }
                     },
                       {
                        title: '角色名',
                        dataIndex: 'name',
                        type: 'input',
                        decorator: ['name',{rules: [{ required: true, message: '角色名称不能为空！' }]}]
                    }, {
                        title: '备注',
                        dataIndex: 'description',
                        type: 'input',
                        decorator: ['description']
                    }],
                    singleCol: true,
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
            menuCheck(checkedKeys, e){
                console.info(checkedKeys);
                console.info(e.halfCheckedKeys);
                let halfCheckedKeys = e.halfCheckedKeys ;
                let that = this;
                that.allCheckedKeys = checkedKeys;

                 halfCheckedKeys.forEach(function(v){
                    that.allCheckedKeys.push(v)
                 });
                console.info(that.allCheckedKeys);
            },
             reset(){
                let _this = this;
                if(_this.filter){
                    Object.keys(_this.filter).forEach(function(key){
                        _this.filter[key] = "";
                    });
                }
                this.searchResult();
            },
            tableChange(pagination) {
                this.ipagination.current = pagination.current;
                this.ipagination.pageSize = pagination.pageSize;
                //this.ipagination.pageSizeOption = pagination.pageSizeOption;
                 this.loadData(this.filter);
            },
            handleAdd() {
                this.form.resetFields();
                this.$emit("resetForm");
                this.title = "新增角色";
                this.visible = true;
                this.editItem = {};

                this.$nextTick(() => {
                    if (this.gridOption.beforeAdd) {
                        this.gridOption.beforeAdd();
                    }
                    this.disabled = false;
                });
            },
            handleEdit(record) {
                this.editItem = record;
                this.title = "编辑角色";
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
                        ids.push(this.dataSource[num].id);
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
                this.handleDelete([record.id]);
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
    
        },
        created (){
            if (this.columns.length == 0) {
                this.columns = _.cloneDeep(this.gridOption.columns);
                //过滤掉不展示的列
                this.columns = _.filter(this.columns, col => {
                    return col.colSpan !== 0;
                });
                let width = 200;
                let btnLength = this.gridOption.extraOperation
                    ? this.gridOption.extraOperation.length + 2
                    : 2;
                if (this.gridOption.btnOperation) {
                    if (
                        this.gridOption.btnOperation.edit === false ||
                        this.gridOption.btnOperation.delete === false
                    ) {
                        btnLength--;
                    }
                }
                switch (btnLength) {
                    case 5:
                        width = 240;
                        break;
                }
                if (!(this.gridOption.showOperation === false)) {
                    this.columns.push({
                        title: "操作",
                        dataIndex: "operation",
                        width: width,
                        scopedSlots: { customRender: "operation" }
                    });
                }
            }
        },
         mounted(){
                this.treeData = this.$store.state.baseData.menuList;
                console.info( this.treeData);
        },
        components: {
            
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
