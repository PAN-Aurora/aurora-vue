<template>
  <a-row >
    <slot name="operate">
      <a-card title="查询条件" hoverable size="default" style="margin-top:0.5em" >
          <a-row class="mgBottom">
            <a-col span="24" v-if="!(gridOption.showFilter === false)">
              <filterBar ref="filter_bar" :filterColumns="gridOption.filterColumns" @query="searchResult"></filterBar>
            </a-col>
          </a-row>
      </a-card>
    </slot>

    <a-card    hoverable size="default" style="margin-top:0.5em" >

    <a-row style="margin-top:0.1em;margin-bottom: 0.1em;">
      <a-space>
        <a-button
                type="primary"
                icon="plus"
                :size="size"
                title="增加"
                v-hasPermission="'user_add'"
                @click="handleAdd"
        >新增
        </a-button>
        <a-button
                class="gridBtn warning"
                icon="delete"
                @click="batchDelete"
                :size="size"
                title="删除选中条目"
                v-hasPermission="'user_delete'"
        >删除</a-button>
      </a-space>
    </a-row>

    <!--表格列表-->
    <a-config-provider>
          <template v-slot:renderEmpty>
            <div style="text-align: center;">
              <p style="color:lightgray">暂无数据</p>
            </div>
          </template>
        <a-table
                bordered
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          @change="tableChange"
          :dataSource="dataSource"
          :columns="columns"
          :pagination="ipagination"
          :loading="loading"
          :rowKey="(item, index) => { return index }"
          style="margin-top:2%"
        >
        <!--操作开始 -->
        <span slot="desc" slot-scope="text, record,index">
            {{index+1}}
        </span>

<!--          <template slot="title" slot-scope="text, record">-->
<!--            <a-space>-->
<!--                <a-button-->
<!--                        type="primary"-->
<!--                        icon="plus"-->
<!--                        :size="size"-->
<!--                        title="增加"-->
<!--                        v-hasPermission="'user_add'"-->
<!--                        @click="handleAdd"-->
<!--                >新增-->
<!--                </a-button>-->
<!--                <a-button-->
<!--                        class="gridBtn warning"-->
<!--                        icon="delete"-->
<!--                        @click="batchDelete"-->
<!--                        :size="size"-->
<!--                        title="删除选中条目"-->
<!--                        v-hasPermission="'user_delete'"-->
<!--                >删除</a-button>-->
<!--            </a-space>-->
<!--          </template>-->


            <!--操作结束 -->
            <template slot="operation" slot-scope="text, record">
              <a-button
                class="gridBtn info"
                title="编辑"
                type="default"
                 shape="circle"
                @click="handleEdit(record)"
                icon="edit"
                size="small"
                v-if="isRender('edit')"
              ></a-button>

              <a-popconfirm v-if="isRender('delete')" title="确认删除?" @confirm="() => onDelete(record)">
                <a-button class="gridBtn warning" type="default"  shape="circle" icon="delete" size="small" title="删除"></a-button>
              </a-popconfirm>

              <a-button
                v-for="(operate,idx) in gridOption.extraOperation"
                :class="operate.classFormat ? operate.classFormat(record) : 'gridBtn'"
                @click="operate.click(record)"
                 shape="circle"
                :title="operate.titleFormat?operate.titleFormat(record) || '':{}"
                size="small"
                :key="idx"
                :icon="operate.iconFormat(record) || 'plus'"
                :style="operate.styleFormat ? operate.styleFormat(record) : {}"
              ></a-button>
            </template>
        </a-table>
    </a-config-provider>

    </a-card>
    <!--新建修改-->
    <a-modal
      :title="title"
      v-model="visible"
      :mask="false"
      :centered="true"
      :maskClosable="false"
      :closable="false"
      :width="modalWidth"
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
          :label-col="{ span: gridOption.formLabelCol || defaultFormLabelCol }"
          :wrapper-col="{ span: gridOption.formWrapperCol || defaultFormWrapperCol, offset: 1 }"
          layout="vertical"
        >
          <span slot="label" :class="gridOption.formLabelClass || ''">{{item.title}}</span>
          <a-select
            v-decorator="item.decorator"
            v-if="item.type == 'select'"
            @change="item.change"
            @focus="bindEvent(item, 'focus')"
            allClear
            :mode="modeFormat(item)"
            :placeholder="item.placeholder || ''"
            :class="item.className || ''"
            :dropdownClassName="item.dropdownClassName || ''"
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
            :class="item.className || ''"
            :default-value="item.default||''"
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
            :class="item.className || ''"
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
            :class="item.className || ''"
            style="width: 100%"
          ></a-input-number>
          <a-textarea
            v-decorator="item.decorator"
            v-if="item.type == 'textarea'"
            :autosize="{ minRows: 4, maxRows: 4 }"
            :placeholder="item.placeholder || ''"
          ></a-textarea>
          <a-tree-select
            allowClear
            @focus="bindEvent(item, 'focus')"
            treeDefaultExpandAll="true"
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
          <a-cascader
            v-decorator="item.decorator"
            v-if="item.type == 'cascader-org'"
            @focus="bindEvent(item, 'focus')"
            :options="frontOptions"
            :loadData="loadOrgData"
            style="width: 100%;"
            :class="item.className"
            :popupClassName="item.popupClassName || ''"
            changeOnSelect
            @change="getFront"
            :placeholder="item.placeholder || ''"
          />
          <a-upload
                   v-if="item.type == 'upload'"
                   :file-list="fileList"
                   :remove="handleRemove"
                   v-decorator="item.decorator"
                   :before-upload="beforeUpload">
            <a-button> <a-icon type="upload" /> 上传</a-button>
          </a-upload>

        </a-form-item>
        <slot name="extra"></slot>
        <a-form-item :wrapper-col="{ span: 8, offset: 10}">
          <a-button type="primary" html-type="submit" ref="transfer" style="display: none">提交</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-row>
</template>
<script>
import { listMixin } from "../maxin/listMixin";
import { warning } from "../utils/alert_util";
import moment from "moment";
import lodash from 'lodash';
import filterBar from "./gridFilterBar";
export default {
  mixins: [listMixin],
  props: ["gridOption"],
  computed: {
    formColumns: function() { // 需要填写的表单字段数组
      let array = this.gridOption.columns.filter(col => {
        return col.editFlag !== false;
      });
      console.info(array);
      return array;

    },
    modalWidth: function(){
      if(this.gridOption.longCol){
        return this.gridOption.longCol;
      }else if(this.gridOption.singleCol === true){
        return 550;
      }else{
        return 1000;
      }
    }
  },
  created() {
    if (this.columns.length == 0) {
      this.columns = lodash.cloneDeep(this.gridOption.columns);
      //过滤掉不展示的列
      this.columns = lodash.filter(this.columns, col => {
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
        case 1:
           width= 50;
           break;
        case 2:
           width= 100;
           break;
        case 3:
           width= 150;
           break;
        case 4:
           width= 200;
           break;
        case 5:
          width = 250;
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
    if(this.gridOption.needFormData){
      this.needFormData = true;
    }
  },
  data() {
    return {
      visible: false,
      title: "新增",
      size: "default",
      form: this.$form.createForm(this),
      editItem: {},
      columns: [],
      filter: {},
      defaultFormLabelCol: 4,
      defaultFormWrapperCol: 16,
      fileList:[],
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
    searchResult(filter) { // 查询数据
      this.filter = filter;
      this.loadData(filter);
    },
    tableChange(pagination) {
      this.ipagination.current = pagination.current;
      this.ipagination.pageSize = pagination.pageSize;
      this.ipagination.pageSizeOption = pagination.pageSizeOption;
      this.searchResult(this.filter);
    },
    // 页面“新增”按钮处理逻辑
    handleAdd() {
        //this.form.resetFields();
       // this.$emit("resetForm");
        this.title = "新增";
        this.visible = true;
        this.editItem = {};
    },
    //修改
    handleEdit(record) {
      this.editItem = record;
      this.title = "编辑";
      this.visible = true;
      let clone = lodash.cloneDeep(record);
      console.log(record);
      this.gridOption.columns.forEach(col => {
        if (["datetimePicker", "datePicker"].indexOf(col.type) > -1) {
          clone[col.dataIndex] = clone[col.dataIndex]
            ? moment(new Date(clone[col.dataIndex]))
            : null;
        }
      });
      console.log(clone)
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
    // 批量删除按钮实现
    batchDelete() {
      if (this.selectedRowKeys.length === 0) {
        warning(this, "请选择删除的条目！");
      } else {
        let ids = '';
        this.selectedRowKeys.forEach(num => {
          if(this.gridOption.deleteKey){
            ids+=this.dataSource[num][this.gridOption.deleteKey]+',';
          }else{
            ids+=this.dataSource[num].id+',';
          }
        });
        ids = ids.substring(0,ids.length - 1);
        this.handleDelete(ids);
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    // 批量导出按钮实现
    batchExport(){
      if (this.selectedRowKeys.length === 0) {
        warning(this, "请选择导出的条目！");
      } else {
        let ids = '';
        this.selectedRowKeys.forEach(num => {
          if(this.gridOption.exportKey){
            ids+=this.dataSource[num][this.gridOption.exportKey]+',';
          }else{
            ids+=this.dataSource[num].id+',';
          }
        });
        ids = ids.substring(0,ids.length - 1);
        this.handleExport(ids);
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
      if(this.gridOption.deleteKey){
        this.handleDelete([record[this.gridOption.deleteKey]]);
      }else{
        this.handleDelete([record.id]);
      }
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
      return lodash.cloneDeep(this.response);
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
