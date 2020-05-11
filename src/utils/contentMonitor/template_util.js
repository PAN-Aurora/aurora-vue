import { GET, POST } from '../restful_util';

export function findTemplate(that, type, templateId){ // 查询模板列表
    let url = '/iptv_ln/template.do?method=findTemplate';
    let trans = { type: type};
    GET(that, url, trans, res => {
        if( !res.data || res.data.list.length == 0){
            that.templateList = [];
            return;
        }
        that.templateList = res.data.list;
        if(templateId){
            that.selectTemplate = templateId+"";
        }
    });

}

export function saveTemplate(that, templateId, type, dataList){ // 保存模板详细信息
    let url = '/iptv_ln/template.do?method=save';
    let formData = new FormData();
    formData.append('templateId', templateId);
    formData.append('dataList',  dataList);
    formData.append('type', type);
    POST(that, url, formData, res => {
        if(res.code != 1){
            that.$message.error(res.message);
        }
    });
}

export function findContent(that, type, templateId){
    let url = '/iptv_ln/template.do?method=findContent';
    let trans = {
        type: type,
        templateId: templateId
    }
    GET(that, url, trans, res => {
        if(res.code == 1){
            that.templateProgramList = res.data.list;
        }
    });
}