<template>
    <div style="margin:0 auto;">
        <!--模块路径开始-->
        <a-breadcrumb>
            <a-breadcrumb-item> <a-icon type="home" /></a-breadcrumb-item>
            <a-breadcrumb-item><a href="javascript:void(0);">系统管理</a></a-breadcrumb-item>
            <a-breadcrumb-item><a href="javascript:void(0);" >用户管理</a></a-breadcrumb-item>
        </a-breadcrumb>
          <!--模块路径结束-->

          <!--查询开始-->
        <a-card title="查询条件" hoverable size="default" style="margin-top:0.5em" >
             <a-col :span="24" v-if="true">
                    <a-row type="flex" justify="center" style="margin:0.5rem;">
                        <a-col :span="5">
                            <label>用户名：</label>
                            <a-input v-model="filter.username" style="width: 60% ;" placeholder="请输入用户名"></a-input>
                        </a-col>
                         <a-col :span="5">
                            <label>真实姓名：</label>
                            <a-input v-model="filter.realName" style="width: 60% ;" placeholder="请输入真实姓名"></a-input>
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
<!--           <template slot="title" slot-scope="text, record">-->
<!--               <a-button-->
<!--                    class="operateBtn"-->
<!--                    type="primary"-->
<!--                    icon="plus"-->
<!--                    :size="size"-->
<!--                    title="增加"-->
<!--                    v-hasPermission="'user_add'"-->
<!--                    @click="handleAdd"-->
<!--                    v-if="isRender('add')"-->
<!--                >新增</a-button>-->
<!--            <a-button-->
<!--                    class="operateBtn warning"-->
<!--                    icon="delete"-->
<!--                    @click="batchDelete"-->
<!--                    :size="size"-->
<!--                    title="删除选中条目"-->
<!--                    v-hasPermission="'user_delete'"-->
<!--                    v-if="isRender('deleteBatch')"-->
<!--                >删除</a-button>-->
<!--            </template>-->
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
                :width="gridOption.singleCol === true ?  550 : 1000"
                :footer="null"
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
                    <a-select
                            v-decorator="item.decorator"
                            v-if="item.type == 'select'"
                            @change="item.change"
                            @focus="bindEvent(item, 'focus')"
                            allClear
                            :mode="modeFormat(item)"
                            :placeholder="item.placeholder || ''"
                    >
                        <a-select-option
                                v-for="option in item.options"
                                :value="option.value"
                                :key="option.value"
                        >{{option.label}}</a-select-option>
                    </a-select>

                    <a-input
                            v-decorator="item.decorator"
                            :disabled="disabled"
                            v-if="item.type == 'input' &&item.dataIndex === 'userName' "
                            :placeholder="item.placeholder || ''"
                    ></a-input>

                     <a-input
                            class="light_input"
                            v-decorator="item.decorator"
                             v-if="item.type == 'input' &&item.dataIndex != 'userName' "
                            :placeholder="item.placeholder || ''"
                    ></a-input>

                    <a-textarea
                             class="light_input"
                            v-decorator="item.decorator"
                            v-if="item.type == 'textarea'"
                            :autosize="{ minRows: 4, maxRows: 4 }"
                            :placeholder="item.placeholder || ''"
                    ></a-textarea>
                     <a-input-number
                            v-decorator="item.decorator"
                            v-if="item.type == 'number'"
                            :placeholder="item.placeholder || ''"
                            style="width: 100%"
                    ></a-input-number>
                    <a-tree-select
                            allowClear
                            treeDefaultExpandAll
                            @focus="bindEvent(item, 'focus')"
                            :treeData="item.treeData"
                            :placeholder="item.placeholder || ''"
                            :treeCheckable="item.treeCheckable ? item.treeCheckable : false"
                            v-decorator="item.decorator"
                            v-if="item.type == 'tree'"
                            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                            :autosize="{ minRows: 4, maxRows: 4 }"
                    ></a-tree-select>
                </a-form-item>
                <slot name="extra"></slot>
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
    import {POST,GET} from '@/utils/restful_util'
    import { listMixin } from "@/maxin/listMixin";
    import { warning,info} from "@/utils/alert_util";
    import moment from "moment";
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
                filter:{
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
                    moduleTitle: '用户管理',
                    modelName: 'user',
                    beforeLoadType:"get",
                    url:{
                        list:"/api/user/getUserList",
                        create: '/api/user/saveUser',
                        update:"/api/user/updateUser",
                        delete:"/api/user/deleteUser",
                    },
                    columns: [
                          {       
                            title: '序号',      
                            width: '8%',
                            editFlag:false,
                              align: 'center',
                            customRender: (text, record, index) => {
                                    return (index+1)
                            }
                        },
                        {
                            title: '用户名',
                            dataIndex: 'username',
                            type: 'input',
                            align: 'center',
                            decorator: ['username'
                                ,{ rules:
                                        [{
                                             required: true
                                            , message: '用户名不能为空（由大小字母和数字组成）！'
                                            , pattern:"^[0-9a-zA-Z_]{1,}$"
                                        }]
                                 }]
                        },
                         {
                            title: '密码',
                            dataIndex: 'password',
                            type: 'input',
                             align: 'center',
                            colSpan:0,
                            placeholder:'不输入密码默认123456',
                            decorator: ['password'
                                ,{ rules:
                                        [{
                                             required: false
                                            , message: '密码不能为空！'
                                        }]
                                 }]
                        },
                     {
                        title: '真实姓名',
                        dataIndex: 'realName',
                        type: 'input',
                         align: 'center',
                        decorator: ['realName',{rules: [{ required: true, message: '真实姓名不能为空！' }]}]
                    }, 
                    {
                        title: '角色',
                        dataIndex: 'role',
                        type: 'select',
                        align: 'center',
                        options: [],
                        decorator: ['role', {rules: [{ required: true, message: '角色不能为空！' }]}],
                        customRender: (role) => {
                            if(role && role.name){
                                return role.name;
                            }else{
                                return '';
                            }
                            
                        }
                    },
                       
                        {
                        title: '性别',
                        dataIndex: 'sex',
                        type: 'select',
                            align: 'center',
                        options: [
                            {
                            value:0,
                            label:'男'
                        }, {
                            value:1,
                            label:'女'
                        }
                        ],
                        decorator: ['sex'],
                        customRender: (sex) => {
                            if(sex === 0){
                                return '男';
                            }else{
                                return '女';
                            }
                        }
                    },
                       {
                        title: '年龄',
                        dataIndex: 'age',
                           align: 'center',
                        type: 'number',
                        decorator: ['age']
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
                this.title = "新增用户";
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
                let width = 200;
                
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