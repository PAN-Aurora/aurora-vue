<template>
    <div style="margin-left: 0.5em">
            <div class="outer" @drop="handleDrop" @dragover.prevent>
                <h3 style="width: 100%;text-align: center">拖拽您想要上传的文件到此处或
                    <a-upload 
                        :name="tableOption.file" 
                         withCredentials
                        :fileList="fileList"
                        :remove="remove"
                        :customRequest="importData"
                        :data="tableOption.fileParam"
                        :beforeUpload="handleBeforeUpload" 
                        :showUploadList="true">
                        <a-button >
                            <a-icon type="upload" /> 上传
                        </a-button>
                    </a-upload>
                </h3>
            </div>
            <div class="outer_btn">
                   <a-button type="primary"  class="success" icon="download" style="margin-right:10px" @click="exportTemplate">模板下载</a-button>
                   <a-button type="primary" icon="close" @click="handleCancel">关闭</a-button>
            </div>
         
    </div>
</template>
<script>
    import Vue from 'vue'
    import {info, warning} from '../utils/alert_util'

    export default {
        props: {
            tableOption:{
                type:Object
            }

        },
        components: {
        },
        data () {
            return {
                file:Object, //当前文件
                fileList:[],//上传的文件列表
                headers: {
                            'Content-Type': 'multipart/form-data',  
                }
            }
        },
        computed: {
        },
        methods: {
            //自定义导入方法
            importData () {
                let data = new FormData();
                data.append(this.tableOption.file,this.file);

                console.info(this.fileList);
                let params = {};
                 //导入之前其他参数处理
                if(this.tableOption.beforeImport){
                    this.tableOption.beforeImport(params);
                }
                for (let item in params){
                    data.append(item,params[item]);
                }
                //此处必须设置为  multipart/form-data
                 let config = {
                        headers: this.headers
                  };
                  this.$axios.post(this.tableOption.url.import, data, config).then( (res) => {
                        console.info(res.data);
                        res = res.data;
                        if (res.code === 1) {
                            info(this, res.message)
                            this.fileList=[];
                            this.handleCancel();
                           
                        } else {
                            warning(this, res.message)
                            return false;
                        }
                    //做处理
                    }).catch((error) =>{
                        console.info(error);
                        warning(this,"导入操作失败!");
                        return false;
                  });
            },
            remove(file){
                 console.info(file);
                 for (let i = 0; i < this.fileList.length; i++) {
                        if (this.fileList[i].uid === file.uid) {
                             this.fileList.splice(i, 1); 
                             i--; 
                         }
                }
                return true;
            },
            //取消 关闭窗口
            handleCancel () {
                this.$parent.$parent.close();
            },
            //拖拽或者选择文件后处理
            handleBeforeUpload (f) {
                console.info(f);
                if(this.fileList.length === 0){
                     this.file = f;
                     this.fileList.push(f); 
                     return true
                }else{
                    warning(this,"单次只能导入一个文件");
                    return false;
                }
           
            },
           //拖拽导入
            handleDrop (e) {
                e.stopPropagation(); 
                e.preventDefault();
                let f = e.dataTransfer.files[0]
                 if(this.fileList.length === 0){
                    this.file = f;
                    this.fileList.push(f);
                     return true;
                }else{
                    warning(this,"单次只能导入一个文件");
                    return false;
                }
            },
            //点击右上角X
            cancel(e){ 
                 this.handleCancel();
            },
            //下载模板
            exportTemplate () {
                this.openDownloadDialog(this.tableOption.url.importBase,this.tableOption.importTitle);
            },
            openDownloadDialog(url, saveName) {
                if (typeof url == 'object' && url instanceof Blob) {
                    url = URL.createObjectURL(url); // 创建blob地址
                }
                let aLink = document.createElement('a');
                aLink.href = url;
                aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
                let event;
                if (window.MouseEvent) event = new MouseEvent('click');
                else {
                    event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                }
                aLink.dispatchEvent(event);
            }
        }
    }
</script>
<style lang="less" scoped>
    .outer{
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed lightgrey;
        border-radius: 5px;
        height: 100px;
        flex-wrap: wrap;
        margin-bottom: 1em;
    }
     .outer_btn{
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed lightgrey;
        border-radius: 5px;
        height: 40px;
        flex-wrap: wrap;
        margin-bottom: 1em;
    }
</style>