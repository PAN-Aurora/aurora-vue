<template>
    <div>
        <grid :gridOption="gridOption" ref="channelGrid">
            <template v-slot:extraOperate>
                <!-- <xlsx :option="xlslOption" :tableOption="tableOption" :frontId="frontId" @importSuccess="updateGrid"></xlsx> -->
                <a-button 
                  icon="upload"
                  style="margin-left: 0.5em"
                  class="success"
                  @click="batchExport"
                  size="large" title="导出"></a-button>
            </template>
        </grid>
    </div>
</template>
<script>
    import grid from '../../components/grid.vue'
    import xlsx from '../../components/xlsxImport.vue'
//    import frontTree from '../../components/localeFrontTree.vue'
    import {GET} from '../../utils/restful_util'
//    import Bus from '../../utils/bus'
    export default {
        data () {
            return {
                gridOption: {
                    // beforeSubmit: (values) => {
                    //   values.frontId = this.$refs['frontTree'].checkedKey
                    //   return values
                    // },
                    gridFilter:{

                    },
                    moduleTitle:'直播节目',
                    showFilter:true, //显示筛选框
                    longCol: 750, // 指定节目创建界面对话框宽度
                    singleCol: true, // 指定表单填写字段为每个字段占一行
                    formLabelCol: 3, // 指定表单label所占宽度比
                    formWrapperCol :19, // 指定表单填写内容所占宽度比
                    needFormData: true, // 将需要提交的数据转成FormData格式
                    deleteKey: 'programId',
                    exportKey: 'programId',
                    formLabelClass: 'light_form_label',
                    btnOperation: {
                         add: false,
                         deleteBatch: false,
                         edit:false,
                         delete:false,
                    },
                    extraOperation: [
                        {
                            titleFormat: ()=>{ return '导出'} ,
                            click: (record) => {
                                this.$refs['channelGrid'].handleExport(record.programId);
                            },
                            classFormat: () => {
                                return 'success'
                            },
                            iconFormat: () => {
                                return 'upload'
                            }
                        }
                    ],
                    filterColumns:{
                        cascader:[
                            {
                                label: '所属终端',
                                prop: 'orgArr'
                            }
                        ],
                        basic:[
                           
                            {
                                label:"节目名称",
                                type:"input",
                                prop: "name",
                               // width:'60%',
                               // sectionWidth: '20%'
                            },
                            {
                                label:"上架时间",
                                type:"datetime",
                                prop: "startDateMoment",
                               // width:'30%',
                               // sectionWidth: '20%',
                                needFormat: true
                            },
                            {
                                label:"下架时间",
                                type:"datetime",
                                prop: "endDateMoment",
                               // width:'40%',
                               // sectionWidth: '20%',
                                needFormat: true
                            }
                        ],
                    },
                    modelName: 'front',
                    loadData: true,
                    url: {
                        list: '/api/liveProgram.do?method=list',
                        create: '/api/liveProgram.do?method=add',
                        delete: '/api/liveProgram.do?method=delete',
                        update: '/api/front/channelUpdate',
                        export: '/api/liveProgram.do?method=exportProgram'
                    },
                    columns: [
                        {       
                            title: '序号',      
                            width: '5%', 
                            scopedSlots: { customRender: 'desc'},
                            editFlag: false
                            
                        },
                        {
                            title: '前端',
                            dataIndex: 'orgArr',
                            type: 'cascader-org',
                            className: 'light_cascader',
                            popClassName: 'light_scroll',
                            colSpan: 0,
                            placeholder: '机构信息',
                            decorator: ['orgArr',{rules: [{required: true, message: '前端信息不能为空'}]}]
                        },
                    {
                        title: '频道信息',
                        dataIndex: 'channelId',
                        type: 'select',
                        decorator: ['channelId',{rules: [{ required: true, message: '频道信息不能为空！' }]}],
                        colSpan: 0,
                        options: [],
                        focus: this.getChannelList,
                        className: 'light_a_select',
                        placeholder: '频道信息',
                        dropdownClassName:'light_a_select_option'
                    }, 
                  {
                        title: '终端名称',
                        dataIndex: 'orgName',
                        filter: true,
                        editFlag: false
                    },  
                    {
                        title: '频道名称',
                        dataIndex: 'channelName',
                        type: 'input',
                        decorator: ['channelName',{rules: [{ required: true, message: '频道名称不能为空！' }]}],
                        filter: true,
                        editFlag: false
                    },  
                    {
                        title: '节目名称',
                        dataIndex: 'programName',
                        type: 'input',
                        className: 'light_input',
                        placeholder: '节目名称',
                        decorator: ['programName', {rules: [{ required: true, message: '节目名称不能为空！' }]}]
                    }, 
                    {
                        title: '节目编码',
                        dataIndex: 'reviewCode',
                        type: 'input',
                        className: 'light_input',
                        placeholder: '节目编码',
                        decorator: ['reviewCode', {rules: [{ required: true, message: '节目编码不能为空！' }]}],
                        colSpan: 0
                    }, 
                    {
                        title: '上架时间',
                        dataIndex: 'onShelfTime',
                        editFlag: false
                    }, 
                    {
                        title: '下架时间',
                        dataIndex: 'underShelfTime',
                        editFlag: false
                    },
                    {
                        title: '上架时间',
                        dataIndex: 'startTime',
                        type: 'datetimePicker',
                        className: 'light_date_picker',
                        placeholder: '上架时间',
                        decorator: ['startTime',{rules: [{ required: true, message: '上架时间不能为空！' }]}],
                        colSpan: 0
                    }, 
                    {
                        title: '下架时间',
                        dataIndex: 'endTime',
                        type: 'datetimePicker',
                        className: 'light_date_picker',
                        placeholder: '下架时间',
                        decorator: ['endTime',{rules: [{ required: true, message: '下架时间不能为空！' }]}],
                        colSpan: 0
                    }]
                },
                xlslOption: {
                    icon: 'upload'
                },
                tableOption: {},
                frontId: ''
            }
        },
        methods: {
            updateGrid () { // 查询直播频道列表
                // if (filter.frontId.length === 16) {
                    // this.$refs['channelGrid'].filters = filter
                    this.$refs['channelGrid'].loadData()
                // }
            },
            batchExport(){ // 批量导出
                this.$refs['channelGrid'].batchExport();
            },
            getChannelList(){
                if(this.$refs['channelGrid'].form.getFieldValue('orgArr').length === 3){
                    let orgId = this.$refs['channelGrid'].form.getFieldValue('orgArr')[2];
                    let url = '/javaApi/liveProgram.do?method=channelList';
                    let trans = {orgId:orgId};
                    GET(this, url, trans, (res) => {
                        let arr = [];
                        for(let item of res.data.list){
                            arr.push({value:item.channelId,label: item.channelName});
                        }
                        this.gridOption.columns[1].options = arr;
                    });
                }
            }
        },
        created (){
            this.tableOption.columns = this.gridOption.columns.map((col) => {
                return {
                    title: col.title,
                    dataIndex: col.dataIndex,
                    type: col.type,
                    scopedSlots: {customRender: col.dataIndex}
                }
            })
        },
        mounted () {
            //Bus.$on('importSuccess', (filter) => {
                this.updateGrid(); // 页面加载时查询一次直播频道列表
            //})
        },
        components: {
            grid,
            xlsx,
            //frontTree
        }
    }
</script>
<style lang="less" scoped>
.test{
    font: 100
}
</style>
<style lang="less">
@import "../../customStyle/dartStyle.less";
</style>