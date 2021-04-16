import axios from 'axios'
import _ from 'lodash'
export const getBaseData = ({commit, state}) => {
    //资源树初始化
    if (state.baseData.menuList.length == 0) {
          axios.post('/api/resource/getResourceListTree',{}).then(function(response) {
            let formatArray = response.data.data.map((item) => {
                return {
                    key: item.key,
                    idKey: item.idKey,
                    children:item.children,
                    title: item.title,
                    name: item.title,
                }
            })
              console.info(formatArray);
            commit('updateMenuListData', formatArray)
        })

    }
}
