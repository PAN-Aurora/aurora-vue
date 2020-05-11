/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import {POST,GET} from '../utils/restful_util'
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
                showQuickJumper: false,
                showSizeChanger: true,
                total: 0
            },
            /* 筛选参数 */
            filters: {},
            /* table加载状态 */
            loading:false,
            /* table选中keys*/
            selectedRowKeys: [],
            /* table选中records*/
            selectionRows: [],
            response: {}
        }
    },
    created() {
        if (!(this.gridOption.loadData === false)) {
            this.loadData()
        }
    },
    methods: {
        generateFilter (transFilter) {
            let filter = transFilter ? transFilter : this.gridOption.gridFilter;
            filter.page = this.ipagination.current
            filter.pageSize = this.ipagination.pageSize
            return filter
        },
        loadData (filter) {
            let url = this.gridOption.url ? this.gridOption.url.list : '/api/' + this.gridOption.modelName + '/list'
            this.loading = true
            if (this.gridOption.beforeLoadType && this.gridOption.beforeLoadType ==="post" ) {
                POST(this, url, this.generateFilter(filter), (res) => {
                    this.loading = false
                    if (res.code == 1) {
                        this.dataSource = res.data.list
                        this.ipagination.total =  res.data.total;
                        this.response = res.data
                    } else {
                        warning(this, res.message)
                    }
                })
            }else{
                GET(this, url, this.generateFilter(filter), (res) => {
                    this.loading = false
                    if (res.code == 1) {
                        this.dataSource = res.data.list
                        this.ipagination.total =  res.data.total;
                        this.response = res.data
                    } else {
                        warning(this, res.message)
                    }
                })
            }

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
                    if (this.editItem.id) {
                        values.id = this.editItem.id
                        url = this.gridOption.url ? this.gridOption.url.update : '/api/' + this.gridOption.modelName + '/update'
                    } else {
                        url =  this.gridOption.url ? this.gridOption.url.create : '/api/' + this.gridOption.modelName + '/create'
                    }
                    values = this.formatValues(values)
                    console.info(values);
                    if (this.gridOption.beforeSubmit) {
                        values = this.gridOption.beforeSubmit(values, this.editItem)
                    }
                    if (this.gridOption.beforeSubmitType && this.gridOption.beforeSubmitType ==="post" ) {
                        if(values) {
                            POST(this, url, values, (res) => {
                                if (res.code == 1) {
                                    this.visible = false
                                    info(this, res.message)
                                    let  search = {};
                                    if (this.gridOption.gridReload) {
                                        search =   this.gridOption.gridReload(values)
                                    }
                                    this.loadData(search);
                                } else {
                                    warning(this, res.message)
                                }
                            })
                        }
                    }else{
                        if(values) {
                            GET(this, url, values, (res) => {
                                if (res.code == 1) {
                                    this.visible = false
                                    info(this, res.message)
                                    let  search = {};
                                    if (this.gridOption.gridReload) {
                                        search =   this.gridOption.gridReload(values)
                                    }
                                    this.loadData(search);
                                } else {
                                    warning(this, res.message)
                                }
                            })
                        }
                    }

                }
            });
        },
        handleDelete (ids) {
            let url = this.gridOption.url ? this.gridOption.url.delete :'/api/' + this.gridOption.modelName + '/delete'
            GET(this, url, {ids: ids}, (res) => {
                if (res.code === 1) {
                    info(this, res.message)
                    let search = {};
                    if (this.gridOption.afterDelReload) {
                         this.gridOption.afterDelReload(search)
                    }
                    this.loadData(search);
                } else {
                    warning(this, res.message)
                }
            })
        }
    }
}