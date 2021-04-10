<template>
    <a-row type="flex" justify="center" >
        <a-form :form="form" @submit="handleSubmit">
            <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    layout="vertical">
                <span class="form_label_new" slot="label">任务名称</span>
                <a-input style="width:95%;" class="model_form_input"
                         v-decorator="['taskName', { rules: [{ required: true, message: '请填写任务名称' }] }]"
                />
            </a-form-item>


            <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    layout="vertical">
                <span class="form_label_new" slot="label">类型</span>

                <a-radio-group
                        style="width: 95%"
                        v-decorator="['taskName', { rules: [{ required: true, message: '请填写任务名称' }] }]"
                         >
                    <a-radio :value="0" style="color:#ffffff;">直播</a-radio>
                    <a-radio :value="1" style="color:#ffffff;">点播</a-radio>
                </a-radio-group>
            </a-form-item>


            <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
            >
                <span class="form_label_new" slot="label">开始时间</span>
                <a-date-picker
                        showTime placeholder="任务开始时间"
                        style="width: 95%"
                        v-decorator="['startTime', { rules: [{ required: true, message: '请填写任务开始时间' }] }]"/>
            </a-form-item>
            <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
            >
                <span class="form_label_new" slot="label">结束时间</span>
                <a-date-picker
                        showTime placeholder="任务结束时间"
                        style="width: 95%"
                        v-decorator="['endTime', { rules: [{ required: true, message: '请填写任务结束时间' }] }]"/>
            </a-form-item>

            <a-form-item
                    :wrapperCol="{ span: 24 }"
                    style="text-align: right;margin-right: 48px"
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
            }
        },
        data() {
            return{
                form: this.$form.createForm(this),
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4 }
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 18 }
                },
                urls: {
                    add: '/javaApi/whole.do?method=startMuti',
                    edit: '/javaApi/whole.do?method=startMuti',
                },
            }

        },
        beforeCreate() {
            this.form = this.$form.createForm(this);
        },
        components: {
        },
        mounted() {

        },
        methods: {
            // 提交
            async handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let formData = new FormData();
                        formData.append("taskName", values.taskName);
                        formData.append("departMentId",  this.departmentId);
                        formData.append("startTime", moment(values.startTime).format('YYYY-MM-DD HH:mm:ss'));
                        formData.append("endTime", moment(values.endTime).format('YYYY-MM-DD HH:mm:ss'));

                        POST(this ,this.urls.add, formData, (res) => {
                            if(res.code == '1'){
                                this.$message.info('任务创建成功');
                                this.$parent.$parent.close();
                            }else{
                                if(!res.message){
                                    this.$message.error('任务创建失败');
                                }
                                if(res.message){
                                    this.$message.error(res.message);
                                }
                            }
                        });

                    }
                });
            },
            closeModal(){
                this.$parent.$parent.close();
            },
        },

        created(){
        }
    }
</script>
<style lang="less" scoped>

</style>