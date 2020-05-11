import { GET } from '../restful_util';

export function getFirstList(_that) { // 查询一级部门
    GET(_that, '/iptv_ln/statistic.do?method=monitorLevel', {}, res =>{
        _that.firstLevelList = res.data.monitorLevel
    });
}

export function getSecondList(_that, frontId) {
    GET(_that, '/iptv_ln/statistic.do?method=cityLevel&frontId='+frontId, {}, res =>{
        _that.secondLevelList = res.data.cityLevel;
    });
}
export function getThirdList(_that, areaCode) {
    GET(_that,'/iptv_ln/statistic.do?method=orgLevel&areaCode='+areaCode, {}, res => {
        _that.thirdLevelList = res.data.orgLevel;
    });
}

export function formatList(list,type) {
    let valueName = '';
    let labelName = '';
    let isLeaf = false;
    let result_list = [];
    let queryLevel = 0;
    switch(type) {
        case 1:
            valueName = 'manageArea';
            labelName = 'departMentName';
            queryLevel = 1;
            break;
        case 2:
            valueName = 'areaCode';
            labelName = 'areaName';
            queryLevel = 2;
            break;
        case 3:
            valueName = 'level';
            labelName = 'label';
            queryLevel = 3;
            isLeaf = true;
            break;
    }
    for(let i=0; i< list.length; i++){
        result_list[i] = {};
        result_list[i].value = list[i][valueName];
        result_list[i].label = list[i][labelName];
        result_list[i].isLeaf = isLeaf;
        result_list[i].queryLevel = queryLevel;
    }
    return result_list;
}

export function formatListLong(list,type) {
    let valueName = '';
    let labelName = '';
    let titleName = '';
    let isLeaf = false;
    let result_list = [];
    let queryLevel = 0;
    switch(type) {
        case 1:
            valueName = 'manageArea';
            labelName = 'departMentName';
            titleName = 'departMentName';
            queryLevel = 1;
            break;
        case 2:
            valueName = 'areaCode';
            labelName = 'areaName';
            titleName = 'areaName';
            queryLevel = 2;
            break;
        case 3:
            valueName = 'level';
            labelName = 'label';
            titleName = 'label';
            queryLevel = 3;
            break;
        case 4:
            valueName = 'orgId';
            labelName = 'orgName';
            titleName = 'orgName';
            queryLevel = 4;
            isLeaf = true;
            break;
    }
    for(let i=0; i< list.length; i++){
        result_list[i] = {};
        result_list[i].value = list[i][valueName];
        result_list[i].label = list[i][labelName];
        result_list[i].title = list[i][titleName];
        result_list[i].isLeaf = isLeaf;
        result_list[i].queryLevel = queryLevel;
    }
    return result_list;
}

export async function getMonitorDepart(_that) {
    let url = '/iptv_ln/downBox.do?method=searchMonitorDepartment';
    let res = await _that.Request.get(_that,url,{});
    _that.monitorDepartmentList = res;
}

export async function getAreaList(_that, manageArea) {
    let url = '/iptv_ln/downBox.do?method=searchVieAreaCity&manageArea='+manageArea;
    let res = await _that.Request.get(_that, url, {});
    _that.areaList = res;
}

export async function getLevelList(_that, areaCode) {
    let url = '/iptv_ln/downBox.do?method=searchLevel&areaCode='+areaCode;
    let res = await _that.Request.get(_that, url, {});
    for(let i = 0; i < res.length; i++) {
        res[i].label = getLevelLabel(res[i].level);
    }
    _that.levelList = res;
    _that.areaCode = areaCode;
}

export async function getOrgList(_that, level) {
    let url = '/iptv_ln/downBox.do?method=searchOrgName&areaCode='+_that.areaCode+'&level='+level;
    let res = await _that.Request.get(_that, url, {});
    _that.orgList = res;
}

function getLevelLabel(value) {
    switch(value) {
        case 1:
            return '一级终端';
        case 2:
            return '二级终端';
        case 3:
            return '三级终端';
        case 6:
            return '六级终端';
    }
}