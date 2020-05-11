import { POST,GET } from './restful_util';
// 查询分中心
export function getBranchCenterList(_that) {
    GET(_that, '/javaApi/downBox.do?method=searchMonitorDepartment', {}, res =>{
        let array = [];
        res.data.forEach(item=>{
            let data={};
            data.label = item.departMentName,
                data.value = item.manageArea
            array.push(data);
        });
        _that.branchCenterList = array;
    });
}

// 查询分中心
export async function getCenterList(_that) {
    let res = await _that.Request.get(
        _that,
        '/javaApi/downBox.do?method=searchMonitorDepartment'
        ,{});
    _that.departmentList = res;
}

// 查询分中心
export async function getFontCenterList(_that) {
    let res = await _that.Request.get(
        _that,
        '/javaApi/downBox.do?method=searchMonitorDepartment'
        ,{});
    _that.fontDepartmentList = res;
}


//查询分中心下对应的省份
export async function getProvinceList(_that,data) {
 
    let res = await _that.Request.get(
        _that,
        '/javaApi/downBox.do?method=searchVieAreaCity'
        ,{
           params: data
         });
    _that.provinceList = res;
}

//查询分中心下对应的省份
export async function getFontProvinceList(_that,data) {
 
    let res = await _that.Request.get(
        _that,
        '/javaApi/downBox.do?method=searchVieAreaCity'
        ,{
           params: data
         });
    _that.fontProvinceList = res;
}
//获取不同省份包含的终端级别
export async function getLeveList(_that,data) {
    let res = await _that.Request.get(_that,'/javaApi/downBox.do?method=searchLevel',{
        params: data
      });
      for(let i = 0; i < res.length; i++) {
         res[i].label = getLevelLabel(res[i].level);
    }
    _that.levelList = res;
}
//获取不同省份包含的终端级别
export async function getFontLevelList(_that,data) {
    let res = await _that.Request.get(_that,'/javaApi/downBox.do?method=searchLevel',{
        params: data
      });
      for(let i = 0; i < res.length; i++) {
         res[i].label = getLevelLabel(res[i].level);
    }
    _that.fontLevelList = res;
}

//获取不同的终端
export async function getTerminalList(_that,data) {
    let res = await _that.Request.get(_that,'/javaApi/downBox.do?method=searchOrgName',{
        params: data
      });
    _that.terminalList = res;
}

//获取不同的终端
export async function getFontTerminalList(_that,data) {
    let res = await _that.Request.get(_that,'/javaApi/downBox.do?method=searchOrgName',{
        params: data
      });
    _that.fontTerminalList = res;
}





//转换list 
export function formatList(list,type) {
    let valueName = '';
    let labelName = '';
    let titleName = '';
    let idName ="";
    let isLeaf = false;
    let result_list = [];
    let level = 0;
    switch(type) {
        case 1:
            valueName = 'departMentId';
            labelName = 'departMentName';
            titleName = 'departMentName';
            idName ="manageArea"
            level = 1;
            break;
        case 2:
            valueName = 'areaCode';
            labelName = 'areaName';
            titleName = 'areaName';
            idName ="areaId"
            level = 2;
            break;
        case 3:
            valueName = 'level';
            labelName = 'label';
            titleName = 'label';
            idName ="level"
            level = 3;
            break;
        case 4:
            valueName = 'orgId';
            labelName = 'orgName';
            titleName = 'orgName';
            idName ="orgId"
            level = 4;
            isLeaf = true;
            break;
    }
    for(let i=0; i< list.length; i++){
        result_list[i] = {};
        result_list[i].value = list[i][valueName];
        result_list[i].label = list[i][labelName];
        result_list[i].title = list[i][titleName];
        result_list[i].id = list[i][idName];
        result_list[i].isLeaf = isLeaf;
        result_list[i].level = level;
    }
    return result_list;
}

//转换list 
export function formatListNoOrg(list,type) {
    let valueName = '';
    let labelName = '';
    let titleName = '';
    let idName ="";
    let isLeaf = false;
    let result_list = [];
    let level = 0;
    switch(type) {
        case 1:
            valueName = 'departMentId';
            labelName = 'departMentName';
            titleName = 'departMentName';
            idName ="manageArea"
            level = 1;
            break;
        case 2:
            valueName = 'areaCode';
            labelName = 'areaName';
            titleName = 'areaName';
            idName ="areaId"
            level = 2;
            break;
        case 3:
            valueName = 'level';
            labelName = 'label';
            titleName = 'label';
            idName ="level"
            level = 3;
            isLeaf = true;
            break;
    }
    for(let i=0; i< list.length; i++){
        result_list[i] = {};
        result_list[i].value = list[i][valueName];
        result_list[i].label = list[i][labelName];
        result_list[i].title = list[i][titleName];
        result_list[i].id = list[i][idName];
        result_list[i].isLeaf = isLeaf;
        result_list[i].level = level;
    }
    return result_list;
}
//获取级别
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

  //终端级联查询
  export async function loadCascaderData(_that,selectedOptions) {             
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let children =[];
    //点击的级别等于1 说明是监测中心查询省份
    if(targetOption.level == 1){
        
        let params = {
             manageArea:targetOption.id
        }
        await getProvinceList(_that,params); 
        children = formatList(_that.provinceList,2);
 
       
    }else if(targetOption.level == 2){ 
          
          _that.defaultProvince = targetOption.value;
           let params = {
               areaCode:targetOption.value
            }
           await getLeveList(_that,params); 
           children = formatList(_that.levelList,3);

    }else if(targetOption.level == 3){ 
           let params = {
                areaCode:  _that.defaultProvince,
                level:targetOption.value
            }
            await getTerminalList(_that,params); 
            children = formatList(_that.terminalList,4); 
    }
    targetOption.loading = false;
    targetOption.children = children;
    _that.options = [..._that.options];
}

 //终端级联查询
 export async function loadFontCascaderData(_that,selectedOptions) {             
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let children =[];
    //点击的级别等于1 说明是监测中心查询省份
    if(targetOption.level == 1){
        
        let params = {
             manageArea:targetOption.id
        }
        await getFontProvinceList(_that,params); 
        children = formatList(_that.fontProvinceList,2);
 
       
    }else if(targetOption.level == 2){ 
          
          _that.defaultProvince = targetOption.value;
           let params = {
               areaCode:targetOption.value
            }
           await getFontLevelList(_that,params); 
           children = formatList(_that.fontLevelList,3);

    }else if(targetOption.level == 3){ 
           let params = {
                areaCode:  _that.defaultProvince,
                level:targetOption.value
            }
            await getFontTerminalList(_that,params); 
            children = formatList(_that.fontTerminalList,4); 
    }
    targetOption.loading = false;
    targetOption.children = children;
    _that.options = [..._that.options];
}


 //初始化加载总端
 export async function initCascaderData(_that,lodash){
    let  cascader_value = localStorage.getItem("cascader_value");
    if(cascader_value){
            _that.orgArray = cascader_value.split(",");

            let clone = {
                departMentId:_that.orgArray[0],
                areaCode:_that.orgArray[1],
                levelType:_that.orgArray[2],
                orgId:_that.orgArray[3],
            }
            
            _that.defaultProvince = clone.areaCode;
            //获取数据对应的部门数据
            let manageAreaItem = _that.departmentList.find(function(item, index, arr){
                        if(item.value.indexOf(clone.departMentId)>=0){
                            return true;
                        }
            });
            //获取省份数据
            let params = {
                    manageArea:manageAreaItem.id
            }
            await getProvinceList(_that,params); 
            let areaList  = formatList(_that.provinceList,2);

            //获取级别数据
            params = {
                areaCode:clone.areaCode
            }
            await getLeveList(_that,params); 
            let levelList = formatList(_that.levelList,3);
                
            //获取终端数据
            params = {
                areaCode:  clone.areaCode,
                level:clone.levelType
            }
            await getTerminalList(_that,params); 
            let orgList = formatList(_that.terminalList,4); 


            let m_index = lodash.findIndex(_that.departmentList, function(o){return o.value.indexOf(clone.departMentId)>=0});
            _that.options[m_index].children = areaList;

            //级别
            let a_index = lodash.findIndex(_that.options[m_index].children, function(o){return o.value.indexOf(clone.areaCode)>=0});
            _that.options[m_index].children[a_index].children = levelList;
            
            //总端
            let t_index = lodash.findIndex(_that.options[m_index].children[a_index].children,function(o){return o.value == clone.levelType});
            _that.options[m_index].children[a_index].children[t_index].children = orgList;


            //所属前端
            let orgArr = new Array();
            orgArr[0] = manageAreaItem.value;
            orgArr[1] = clone.areaCode;
            orgArr[2] = parseInt(clone.levelType);
            orgArr[3] = clone.orgId;

            _that.orgArray = orgArr;
           
    }


}

//修改加载
 export async function initEditOrgData(_that,lodash,cascader_value){
    if(cascader_value){
            _that.orgArray = cascader_value;
            let clone = {
                departMentId:_that.orgArray[0],
                areaCode:_that.orgArray[1],
                levelType:_that.orgArray[2],
                orgId:_that.orgArray[3],
            }
            
            _that.defaultProvince = clone.areaCode;
            //获取数据对应的部门数据
            let manageAreaItem = _that.departmentList.find(function(item, index, arr){
                        if(item.value.indexOf(clone.departMentId)>=0){
                            return true;
                        }
            });
            //获取省份数据
            let params = {
                    manageArea:manageAreaItem.id
            }
            await getProvinceList(_that,params); 
            let areaList  = formatList(_that.provinceList,2);

            //获取级别数据
            params = {
                areaCode:clone.areaCode
            }
            await getLeveList(_that,params); 
            let levelList = formatList(_that.levelList,3);
                
            //获取终端数据
            params = {
                areaCode:  clone.areaCode,
                level:clone.levelType
            }
            await getTerminalList(_that,params); 
            let orgList = formatList(_that.terminalList,4); 

            let m_index = lodash.findIndex(_that.departmentList, function(o){return o.value.indexOf(clone.departMentId)>=0});
            _that.options[m_index].children = areaList;

            //级别
            let a_index = lodash.findIndex(_that.options[m_index].children, function(o){return o.value.indexOf(clone.areaCode)>=0});
            _that.options[m_index].children[a_index].children = levelList;
            //总端
            let t_index = lodash.findIndex(_that.options[m_index].children[a_index].children,function(o){return o.value == clone.levelType});
            _that.options[m_index].children[a_index].children[t_index].children = orgList;


            //所属前端
            let orgArr = new Array();
            orgArr[0] = manageAreaItem.value;
            orgArr[1] = clone.areaCode;
            orgArr[2] = parseInt(clone.levelType);
            orgArr[3] = clone.orgId;
            _that.orgArray = orgArr;
           
    }


}

//修改加载
export async function initEditNoOrgData(_that,lodash,cascader_value){
    if(cascader_value){
            _that.orgArray = cascader_value;
            let clone = {
                departMentId:_that.orgArray[0],
                areaCode:_that.orgArray[1],
                levelType:_that.orgArray[2],
            }
            
            _that.defaultProvince = clone.areaCode;
            //获取数据对应的部门数据
            let manageAreaItem = _that.departmentList.find(function(item, index, arr){
                        if(item.value.indexOf(clone.departMentId)>=0){
                            return true;
                        }
            });
            //获取省份数据
            let params = {
                    manageArea:manageAreaItem.id
            }
            await getProvinceList(_that,params); 
            let areaList  = formatListNoOrg(_that.provinceList,2);

            //获取级别数据
            params = {
                areaCode:clone.areaCode
            }
            await getLeveList(_that,params); 
            let levelList = formatListNoOrg(_that.levelList,3);
                
            let m_index = lodash.findIndex(_that.departmentList, function(o){return o.value.indexOf(clone.departMentId)>=0});
            _that.options[m_index].children = areaList;

            //级别
            let a_index = lodash.findIndex(_that.options[m_index].children, function(o){return o.value.indexOf(clone.areaCode)>=0});
            _that.options[m_index].children[a_index].children = levelList;


            //所属前端
            let orgArr = new Array();
            orgArr[0] = manageAreaItem.value;
            orgArr[1] = clone.areaCode;
            orgArr[2] = parseInt(clone.levelType);
            _that.orgArray = orgArr;
           
    }


}
/***
 *  获取两个字符串时间的 时间间隔 天 时  分 秒
 */
export  function dateDifference(startTime,endTime){
    let stime =new Date(startTime).getTime();
    let etime = new Date(endTime).getTime();
    let usedTime = etime - stime;  //两个时间戳相差的毫秒数
    //相隔天数                        
    let days=Math.floor(usedTime/(24*60*60*1000));
    //计算出小时数
    let leave1=usedTime%(24*3600*1000);    //计算天数后剩余的毫秒数
    let hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    let leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
    let minutes=Math.floor(leave2/(60*1000));

    //计算秒数
    let leave3=leave2%(60*1000); //计算分钟后剩余毫秒
    let ms=Math.floor(leave3/(1000));

    let time ="";

     if(days>0){
        time += days + "天"
     }
      if(hours>0){
        time += hours + "时"
     }
     if(minutes>0){
        time += minutes + "分"
     }
     if(ms>0){
         time += ms + "秒"
     }
    return time ;
}

//下载工具
export  function  downVideoUtil(_that,url,data,fileName){
    if(!fileName){
        fileName = 'down.ts'
    }
    let config = {
        responseType: 'blob'
    }
    //设置请求post 下载
    _that.$axios.post(
                url
                ,data
                ,config
    ).then(response => {
        _that.downLoading = false;
        let url = window.URL.createObjectURL(new Blob([response.data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName);
        document.body.appendChild(link)
        link.click()
    }).catch((error) => {
        _that.downLoading = false;
        console.info(error)
        _that.$message.error('下载失败！');
    })
}


/***
 *  格式化分组
 */
export  function groupArr(list,field,value){
    let fieldList = [],att=[];
    list.map((e)=>{
        fieldList.push(e[field])
    })
    //数组去重
    fieldList = fieldList.filter((e,i,self)=>{
        return self.indexOf(e)==i
    })
    for(let j=0;j<fieldList.length;j++){
        //过滤出匹配到的数据
        let arr = list.filter((e)=>{
            return e[field] == fieldList[j];
        })
      
        let data=[];
        arr.forEach((e)=>{
            data.push(e[value]);
        })
        att.push({
            type:arr[0][field],
            list:data.toString()
        })
    }
    return att;
}

/***
 *  字符串判断 是否有值
 */
export  function strHasEmpty(field){
    let flag = true;
    if(field===undefined || field === null ||field===''|| field==='null'  || JSON.stringify(field) === "{}"){
        flag = false;
    }
    return flag;
}