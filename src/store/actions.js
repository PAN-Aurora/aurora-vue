import axios from 'axios'
import _ from 'lodash'
export const getBaseData = ({commit, state}) => {

    //监测中心
    if (state.baseData.departmentData.length == 0) {
        //   axios.post('/javaApi/downBox.do?method=searchMonitorDepartment',{}).then(function(response) {
        //     let formatArray = response.data.data.map((item) => {
        //         return {
        //             key: item.departMentId,
        //             value: item.departMentId,
        //             manageArea:item.manageArea,
        //             title: item.departMentName
        //         }
        //     })

        //     commit('updateDepartmentData', formatArray)
        //     let mapping = _.keyBy(formatArray, 'key')
        //     commit('updateDepartmentMap', mapping)
        // })

    }
}
