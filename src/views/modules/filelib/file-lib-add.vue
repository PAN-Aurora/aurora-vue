<template>
    <a-row type="flex" justify="center" >
        <a-form :form="form" @submit="handleSubmit">

            <a-row :gutter="24">
                <a-col :span="12">
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        layout="vertical">
                    <span class="form_label_new" slot="label">文档编号</span>
                    <a-input style="width:95%;"
                             class="model_form_input"
                             :defaultValue="fileNo"
                             disabled
                             v-decorator="['fileNo', { rules: [{ required: true, message: '请填写文档编号' }] }]"
                    />
                </a-form-item>
                </a-col>
                <a-col :span="12">
                <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        layout="vertical">
                    <span class="form_label_new" slot="label">内容描述</span>
                    <a-textarea style="width:95%;" class="model_form_input"
                             v-decorator="['fileDesc', { rules: [{ required: true, message: '请填写内容描述' }] }]"
                    />
                </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :span="12">
            <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    layout="vertical">
                <span class="form_label_new" slot="label">文档类别</span>

                <a-select
                        style="width: 95%"
                        v-decorator="['fileCategory', { rules: [{ required: true, message: '请填写文档类别' }] }]"
                         >
                    <a-select-option value="国内" >国内</a-select-option>
                    <a-select-option value="国外" >国外</a-select-option>
                </a-select>
            </a-form-item>
                </a-col>
                <a-col :span="12">

            <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    layout="vertical">
                <span class="form_label_new" slot="label">文档类型</span>

                <a-select
                        style="width: 95%"
                        v-decorator="['fileType', { rules: [{ required: true, message: '请填写文档类型' }] }]"
                         >
                    <a-select-option value="PDF" style="color:#ffffff;">PDF</a-select-option>
                    <a-select-option value="WORD" style="color:#ffffff;">WORD</a-select-option>
                </a-select>
            </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter="24">
                <a-col :span="12">
            <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    layout="vertical">
                <span class="form_label_new" slot="label">文档版本</span>
                <a-select
                        defaultValue = "1"
                          style="width: 95%"
                          v-decorator="['fileVersion', { rules: [{ required: true, message: '请填写文档版本' }] }]"
                          >
                    <a-select-option :value="1">版本1.0</a-select-option>
                    <a-select-option :value="2">版本2.0</a-select-option>
                    <a-select-option :value="3">版本3.0</a-select-option>
                    <a-select-option :value="4">版本4.0</a-select-option>
                    <a-select-option :value="5">版本5.0</a-select-option>
                    <a-select-option :value="6">版本6.0</a-select-option>
                    <a-select-option :value="7">版本7.0</a-select-option>
                    <a-select-option :value="8">版本8.0</a-select-option>
                    <a-select-option :value="9">版本9.0</a-select-option>
                    <a-select-option :value="10">版本10.0</a-select-option>

                </a-select>
            </a-form-item>
                </a-col>
                <a-col :span="12">
            <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
            >
                <span class="form_label_new" slot="label">文档上传</span>
                <a-upload
                        v-decorator="['files', { rules: [{ required: true, message: '请选择文件' }] }]"
                        :file-list="fileList"
                        :remove="handleRemove"
                        accept=".doc,.pdf,.docx"
                        :before-upload="beforeUpload">
                    <a-button> <a-icon type="upload" />上传</a-button>
                </a-upload>
            </a-form-item>
                </a-col>
            </a-row>

            <a-form-item
                    :wrapperCol="{ span: 24 }"
                    style="text-align: center;margin-right: 48px"
            >
                <a-button  @click="closeModal" type="primary">取消</a-button>
                <a-button style="margin-left: 8px"  class="success" htmlType="submit" type="primary">创建</a-button>
            </a-form-item>
        </a-form>
    </a-row>
</template>
<script>
    import moment from 'moment';
    import {POST} from '@/utils/restful_util'

    export default {
        name: "file-lib-add",
        props:{
            isEdit: {
                type: Boolean,
                default:false,
            },
            editItem:{
                 type: Object,
                 required: false,
            }
        },
        data() {
            return{
                fileList: [],
                form: this.$form.createForm(this),
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 8 }
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 }
                },
                urls: {
                    add: '/api/filelib/saveFileLib',
                    edit: '/javaApi/whole.do?method=startMuti',
                },
                fileNo:'',
            }

        },
        beforeCreate() {
            this.form = this.$form.createForm(this);

        },
        components: {
        },
        mounted() {
            this.form.resetFields();
            if(!this.isEdit){
                this.fileNo = 'WD-'+Date.now();
                this.form.setFieldsValue({
                    fileNo:this.fileNo
                })
            }else{//修改
                console.info(this.editItem);
                this.edit();
            }

        },
        methods: {
            handleRemove(file) {
                const index = this.fileList.indexOf(file);
                const newFileList = this.fileList.slice();
                newFileList.splice(index, 1);
                this.fileList = newFileList;
            },
            beforeUpload(file) {
                if(this.fileList.length< 1){
                    this.fileList = [...this.fileList, file];
                }else{
                    this.$message.info('目前只支持单个文件上传!');
                }
                return false;
            },
            // 提交
            async handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.info(values);
                        if(values.files.fileList.length <1){
                            this.$message.info('请选择文件上传!');
                            return false;
                        }
                        let formData = new FormData();
                        formData.append("fileNo", values.fileNo);
                        formData.append("fileType", values.fileType);
                        formData.append("fileVersion", values.fileVersion);
                        formData.append("fileCategory", values.fileCategory);
                        formData.append("fileDesc", values.fileDesc);
                        formData.append("files", values.files.file);

                        POST(this ,this.urls.add, formData, (res) => {
                            if(res.code == '200'){
                                this.$message.info('保存成功');
                                this.$parent.$parent.close();
                            }else{
                                if(!res.message){
                                    this.$message.error('保存失败');
                                }
                                if(res.message){
                                    this.$message.error(res.message);
                                }
                            }
                        });

                    }
                });
            },
            //关闭窗口
            closeModal(){
                console.info(11);
                this.$parent.$parent.close();
            },
            //编辑
           edit() {
                this.title = "编辑用户";
                let clone = _.cloneDeep( this.editItem);

                this.$nextTick(() => {
                    // carrynie 去除多余属性
                    let obj = this.form.getFieldsValue();
                    for(let key in obj){
                        if(clone.hasOwnProperty(key)){
                            obj[key] = clone[key]
                        }
                    }
                    this.fileList = [{
                        uid: clone.fileNo,
                        name: clone.fileName,
                        status: 'done',
                        url: clone.filePath,
                       }]
                    console.info(this.fileList);
                    // carrynie 去除多余属性
                    this.form.setFieldsValue(obj);
                });
            },
        },

        created(){
        }
    }
</script>
<style lang="less" scoped>

</style>