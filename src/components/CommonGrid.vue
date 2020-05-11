<template>
    <div>
        <a-row>
            <a-divider v-if="gridOption.moduleTitle"  style="color: white">{{gridOption.moduleTitle}}</a-divider>
            <slot name="operate">
                <a-row class="mgBottom">
                    <a-col span="20" v-if="!(gridOption.showFilter === false)">
                        <filterBar :filterColumns="gridOption.filterColumns"  @query="searchResult"></filterBar>
                    </a-col>
                    <a-col span="4">
                        <a-row type="flex" justify="end">
                            <a-button
                                    class="operateBtn"
                                    type="primary"
                                    icon="plus"
                                    :size="size"
                                    title="增加"
                                    @click="handleAdd"
                                    v-if="isRender('add')"
                            />
                            <a-button
                                    class="operateBtn warning"
                                    icon="delete"
                                    @click="batchDelete"
                                    :size="size"
                                    title="删除选中条目"
                                    v-if="isRender('deleteBatch')"
                            />
                            <slot name="extraOperate"></slot>
                        </a-row>
                    </a-col>
                </a-row>
            </slot>
            <a-table
                    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                    @change="tableChange"
                    :dataSource="dataSource"
                    :columns="columns"
                    :pagination="ipagination"
                    :loading="loading"
                    :rowKey="(item, index) => { return index }"
                    class="specialCss"
            >
                <template slot="operation" slot-scope="text, record">
                    <a-button
                            class="gridBtn info"
                            title="编辑"
                            type="default"
                            @click="handleEdit(record)"
                            icon="edit"
                            size="small"
                            v-if="isRender('edit')"
                    ></a-button>
                    <a-popconfirm v-if="isRender('delete')" title="确认删除?" @confirm="() => onDelete(record)">
                        <a-button class="gridBtn danger" type="default" icon="close" size="small" title="删除"></a-button>
                    </a-popconfirm>
                    <a-button
                            v-for="(operate,idx) in gridOption.extraOperation"
                            :class="operate.classFormat ? operate.classFormat(record) : 'gridBtn'"
                            @click="operate.click(record)"
                            :title="operate.titleFormat?operate.titleFormat(record) || '':{}"
                            size="small"
                            :key="idx"
                            :icon="operate.iconFormat(record) || 'plus'"
                            :style="operate.styleFormat ? operate.styleFormat(record) : {}"
                    ></a-button>
                </template>
            </a-table>
            <a-modal
                    :title="title"
                    v-model="visible"
                    :mask="false"
                    :centered="true"
                    :maskClosable="false"
                    :closable="false"
                    :width="gridOption.singleCol === true ?  550 : 1000"
                    @ok="ok"
                    okText="确认"
                    @cancel="cancel"
                    cancelText="取消"
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
                                :disabled="item.disabled === true ? true : false"
                                v-if="item.type == 'input'"
                                :placeholder="item.placeholder || ''"
                        ></a-input>
                        <a-radio-group
                                v-decorator="item.decorator"
                                @change="bindEvent(item, 'change')"
                                v-if="item.type == 'radioGroup'"
                                :options="item.options"
                        ></a-radio-group>
                        <a-switch
                                v-decorator="item.decorator"
                                v-if="item.type == 'switch'"
                                checkedChildren="是"
                                unCheckedChildren="否"
                        ></a-switch>
                        <a-date-picker
                                v-decorator="item.decorator"
                                v-if="item.type == 'datetimePicker'"
                                format="YYYY-MM-DD HH:mm:ss"
                                style="width: 100%"
                                :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                        ></a-date-picker>
                        <a-date-picker
                                v-decorator="item.decorator"
                                v-if="item.type == 'datePicker'"
                                format="YYYY-MM-DD"
                                style="width: 100%"
                        ></a-date-picker>
                        <a-input-number
                                v-decorator="item.decorator"
                                v-if="item.type == 'number'"
                                :placeholder="item.placeholder || ''"
                                style="width: 100%"
                                :min="item.min || 0 "
                                :max="item.max || 999999999 "
                                :precision="item.precision || 0"
                        ></a-input-number>
                        <a-textarea
                                v-decorator="item.decorator"
                                v-if="item.type == 'textarea'"
                                :autosize="{ minRows: 4, maxRows: 4 }"
                                :placeholder="item.placeholder || ''"
                        ></a-textarea>
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
                        <a-cascader
                                v-decorator="item.decorator"
                                v-if="item.type == 'cascader'"
                                @focus="bindEvent(item, 'focus')"
                                :options="item.options"
                        ></a-cascader>
                    </a-form-item>
                    <slot name="extra"></slot>
                    <a-form-item :wrapper-col="{ span: 8, offset: 10}">
                        <a-button type="primary" html-type="submit" ref="transfer" style="display: none">提交</a-button>
                    </a-form-item>
                </a-form>
            </a-modal>
        </a-row>

    </div>
</template>
<script>
    import { listMixin } from "../maxin/listMixin-java";
    import { warning } from "../utils/alert_util";
    import moment from "moment";
    import filterBar from "./gridFilterBar";
    export default {
        mixins: [listMixin],
        props: ["gridOption"],
        computed: {
            formColumns: function() {
                let array = this.gridOption.columns.filter(col => {
                    return col.editFlag !== false;
                });
                return array;
            }
        },
        created() {
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
        data() {
            return {
                visible: false,
                title: "新增",
                size: "large",
                form: this.$form.createForm(this),
                editItem: {},
                columns: []
            };
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
            searchResult(filter) {
                console.log(filter);
                this.loadData(filter);
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
                this.title = "新增";
                this.visible = true;
                this.editItem = {};

                this.$nextTick(() => {
                    if (this.gridOption.beforeAdd) {
                        this.gridOption.beforeAdd();
                    }
                });
            },
            handleEdit(record) {
                this.editItem = record;
                this.title = "编辑";
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
                    this.handleDelete(ids.toString());
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
                this.handleDelete(record.id);
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
            }
        },
        components: {
            filterBar
        }
    };
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
