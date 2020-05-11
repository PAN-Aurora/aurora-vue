/**
 * 用于处理机构级联下拉框的函数
 */
import { getMonitorDepart, getAreaList, getLevelList, getOrgList } from '../utils/dataManager/organ_util';
export const org_mixin = {
    data() {
        return {
            monitorDepartmentList: [],
            areaList: [],
            levelList: [],
            orgList: [],
            frontOptions: [],
            areaCode: '',
            orgArr: [],
            orgMount: false
        }
    },
    methods: {
        async loadOrgData(selectedOptions) { // 级联下拉框查询下一级
            const targetOption = selectedOptions[selectedOptions.length - 1];
            targetOption.loading = true;
            if(targetOption.queryLevel == 1){
                await getAreaList(this, targetOption.value);
            }
            if(targetOption.queryLevel == 2) {
                await getLevelList(this, targetOption.value);
            }
            if(targetOption.queryLevel == 3){
                await getOrgList(this, targetOption.value);
            }

            // load options lazily
            targetOption.loading = false;
            if(targetOption.queryLevel == 1){
                targetOption.children = this.formatList(this.areaList, 2);
            }
            if(targetOption.queryLevel == 2) {
                targetOption.children = this.formatList(this.levelList, 3);
            }
            if(targetOption.queryLevel == 3) {
                targetOption.children = this.formatList(this.orgList, 4);
            }
            this.frontOptions = [...this.frontOptions];
        },
        formatList(list,type) {
            let valueName = '';
            let labelName = '';
            let keyName = '';
            let isLeaf = false;
            let result_list = [];
            let queryLevel = 0;
            switch(type) {
                case 1:
                    valueName = 'manageArea';
                    labelName = 'departMentName';
                    keyName = 'departMentId';
                    queryLevel = 1;
                    break;
                case 2:
                    valueName = 'areaCode';
                    labelName = 'areaName';
                    keyName = 'areaCode';
                    queryLevel = 2;
                    break;
                case 3:
                    valueName = 'level';
                    labelName = 'label';
                    keyName = 'level';
                    queryLevel = 3;
                    break;
                case 4:
                    valueName = 'orgId';
                    labelName = 'orgName';
                    keyName = 'orgId';
                    queryLevel = 4;
                    isLeaf = true;
                    break;
                }
                for(let i=0; i< list.length; i++){
                    result_list[i] = {};
                    result_list[i].value = list[i][valueName];
                    result_list[i].label = list[i][labelName];
                    result_list[i].key = list[i][keyName];
                    result_list[i].isLeaf = isLeaf;
                    result_list[i].queryLevel = queryLevel;
                }
                return result_list;
        },
        getFront(e,selectedOptions){
            if(!selectedOptions){
                return;
            }
            this.departmentId = selectedOptions[0].key;
            if(e.length>=2){
                this.areaCode = e[1];
            }
            if(e.length < 3){
                return;
            }
            this.orgList = getOrgList(this, e[2]);
        },
        displayRender({ labels }){
            if(labels.length === 4){
                return labels.join(' / ')
            }else{
                return '';
            }
        },
        getDepartment(){
            const that = this;
            getMonitorDepart(that).then(function (){
                that.frontOptions = that.formatList(that.monitorDepartmentList, 1);
            });
        },
        getOrgId(e){ // 获取orgId
            if(e.length === 4){
                this.filter.orgId = e[3];
            }else{
                delete this.filter.orgId;
            }
        }
    },
    mounted() {
        if(this.orgMount === true){
            this.getDepartment();
        }
    },
}