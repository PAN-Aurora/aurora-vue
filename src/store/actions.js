import axios from 'axios'
import _ from 'lodash'
export const getBaseData = ({commit, state}) => {

    //监测中心
    if (state.baseData.departmentData.length == 0) {
          axios.post('/javaApi/downBox.do?method=searchMonitorDepartment',{}).then(function(response) {
            let formatArray = response.data.data.map((item) => {
                return {
                    key: item.departMentId,
                    value: item.departMentId,
                    manageArea:item.manageArea,
                    title: item.departMentName
                }
            })

            commit('updateDepartmentData', formatArray)
            let mapping = _.keyBy(formatArray, 'key')
            commit('updateDepartmentMap', mapping)
        })

    }

    //省份
    if (state.baseData.provinceData.length == 0) {
        axios.post('/javaApi/downBox.do?method=searchVieAreaCity',{}).then(function(response) {
            let formatArray = response.data.data.map((province) => {
                return {
                    key: province.areaCode,
                    value: province.areaCode,
                    title: province.areaName
                }
            })
            commit('updateProvinceData', formatArray)
            let mapping = _.keyBy(formatArray, 'key')
            commit('updateProvinceMap', mapping)
        })
    }

   //直播违规类型/点播违规类型
    if (state.baseData.harmfulCategoryLiveMap.length == 0) {
        let formData = new FormData();
        formData.append("type",'live');
        formData.append("search",'1');
        axios.post('/javaApi/multiTaskMonitor.do?method=SelectHarmfulAlarmCategory',formData).then(function(response) {
            let formatArray = response.data.data.map((province) => {
                return {
                    key: province.id,
                    value: province.id,
                    title: province.categoryName
                }
            })
            let mapping = _.keyBy(formatArray, 'key')
            commit('updateHarmfulCategoryLiveMap', mapping)
        })
        let formData1     = new FormData();
        formData1.append("type",'vod');
        formData1.append("search",'1');
        axios.post('/javaApi/multiTaskMonitor.do?method=SelectHarmfulAlarmCategory',formData1).then(function(response) {
            let formatArray = response.data.data.map((province) => {
                return {
                    key: province.id,
                    value: province.id,
                    title: province.categoryName
                }
            })
        
            let mapping = _.keyBy(formatArray, 'key')
            commit('updateHarmfulCategoryVodMap', mapping)
        })
      }

    //审核用户
    if (Object.keys(state.baseData.departmentMap).length == 0) {
          let formData     = new FormData();
          formData.append("page",1);
          formData.append("pageSize",1000);
          axios.post('/javaApi/user.do?method=SelectUser',formData).then(function(response) {
            let formatArray = response.data.data.list
            let arrayUser = [];
            _(formatArray).forEach(function(value) {
                arrayUser.push({name:value.userName,value:value.userId,label:value.userName});
              });
              commit('updateAuditUserList', arrayUser)
         })
    }


  
    // if (Object.keys(state.baseData.departmentMap).length == 0) {
    //     axios.post('/api/department/list',{}).then(function(response) {
    //         let formatArray = response.data.data.list
    //         let mapping = _.keyBy(formatArray, 'id')
    //         commit('updateDepartmentMap', mapping)
    //     })
    // }
    // if (state.baseData.areaCodeTree.length == 0) {
    //     axios.post('/api/areaCode/tree',{}).then(function(response) {
    //         commit('updateAreaCodeTree', response.data.data.root)
    //     })
    // }

    // if (state.baseData.frontTree.length == 0) {
    //     axios.post('api/front/commonTree',{level: 6}).then(function(response) {
    //         commit('updateFrontTree', response.data.data.tree)
    //     })
    // }
}
