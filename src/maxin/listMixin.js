/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import {POST, GET} from '../utils/restful_util'
import {info, warning} from '../utils/alert_util'
export const listMixin = {
    data(){
        return {
            /* 数据源 */
            dataSource:[
            ],
            /* 分页参数 */
            ipagination:{
                size: 'small',
                current: 1,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30'],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条"
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 1
            },
            /* 筛选参数 */
            filters: {},
            /* table加载状态 */
            loading:false,
            /* table选中keys*/
            selectedRowKeys: [],
            /* table选中records*/
            selectionRows: [],
            response: {},
            needFormData: false // 是否需要将数据转成formData
        }
    },
    created() {
        if (!(this.gridOption.loadData === false)) {
            this.loadData()
        }
    },
    methods: {
        generateFilter (transFilter) {
            let filter = transFilter ? transFilter : {condition: this.gridOption.gridFilter}
            filter.start = this.ipagination.current
            filter.limit = this.ipagination.pageSize
            if (this.gridOption.beforeSearch) {
                filter = this.gridOption.beforeSearch(filter)
            }
            return filter
        },
        loadData (filter) {
            let url = this.gridOption.url ? this.gridOption.url.list : '/iptv_ln/' + this.gridOption.modelName + '/list'
            this.loading = true
            GET(this, url, this.generateFilter(filter), (res) => {
                this.loading = false
                if (res.code == 1) {
                    this.dataSource = res.data.list
                    this.response = res.data
                    this.ipagination.total = res.data.totalCount;
                } else {
                    warning(this, res.message)
                }
            })
        },
        formatValues (values) {
            this.gridOption.columns.forEach((col) => {
                if (col.type == 'switch') {
                    if (values[col.dataIndex] === true) {
                        values[col.dataIndex] = '1'
                    } else {
                        values[col.dataIndex] = '0'
                    }
                }
                if (['datetimePicker', 'datePicker'].indexOf(col.type) > -1) {
                    if (col.type == 'datetimePicker') {
                        values[col.dataIndex] =  values[col.dataIndex] ? values[col.dataIndex].format('YYYY-MM-DD HH:mm:ss') : ''
                    } else {
                        values[col.dataIndex] = values[col.dataIndex] ? values[col.dataIndex].format('YYYY-MM-DD') : ''
                    }
                }
            })
            return values
        },
        handleSubmit (e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    let url = ''
                    console.log(this.editItem)
                    if (this.editItem.id) {
                        values.id = this.editItem.id
                        url = this.gridOption.url ? this.gridOption.url.update : '/iptv_ln/' + this.gridOption.modelName + '/update'
                    } else {
                        url =  this.gridOption.url ? this.gridOption.url.create : '/iptv_ln/' + this.gridOption.modelName + '/create'
                    }
                    values = this.formatValues(values)
                    if (this.gridOption.beforeSubmit) {
                        values = this.gridOption.beforeSubmit(values, this.editItem)
                    }
                    console.log(values)
                    if(values.orgArr){
                        values.orgId = values.orgArr[3];
                        values.levelType = values.orgArr[2];
                        values.areaCode = values.orgArr[1];
                        delete values.orgArr;
                    }
                    if(values) {
                        if(this.needFormData){
                            let formData  = new FormData();
                            for(let item in values){
                                formData.append(item,values[item]);
                            }
                            POST(this, url, formData, (res) => {
                                if (res.code == 1) {
                                    this.visible = false
                                    info(this, res.message)
                                    this.loadData()
                                } else {
                                    warning(this, res.message)
                                }
                            })
                        }else{
                            POST(this, url, values, (res) => {
                                if (res.code == 1) {
                                    this.visible = false
                                    info(this, res.message)
                                    this.loadData()
                                } else {
                                    warning(this, res.message)
                                }
                            })
                        }
                    }
                }
            });
        },
        handleDelete (ids) { // 调用删除接口
            let url = this.gridOption.url ? this.gridOption.url.delete :'/iptv_ln/' + this.gridOption.modelName + '/delete'
            let trans = {};
            if(this.needFormData){
                let formData = new FormData();
                formData.append(this.gridOption.deleteKey,ids);
                trans = formData;
            }else{
                trans = {ids:ids};
            }
            POST(this, url, trans, (res) => {
                if (res.code === 1) {
                    this.loadData()
                    info(this, res.message)
                } else {
                    warning(this, res.message)
                }
            })
        },
        handleExport (ids) { // 导出并下载文档
            let url = this.gridOption.url ? this.gridOption.url.export :'/iptv_ln/' + this.gridOption.modelName + '/export';
            let trans = {};
            trans[this.gridOption.exportKey] = ids;
            GET(this, url, trans, (res) => {
                window.open(res.data.reportUrl);
            });
        }
    }
}