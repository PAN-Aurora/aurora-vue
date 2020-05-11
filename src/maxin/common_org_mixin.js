/**
 *  终端公共类抽取
 */
import lodash from 'lodash';
import {getProvinceList,getCenterList,getLeveList,getTerminalList,formatList,formatListNoOrg} from '../utils/common_util';
//申明common_org_mixin
export const common_org_mixin = {
    data() {
        return {
            options: [], //前端集合
            defaultProvince:"",
            departmentList:[], //监测中心
            provinceList:[] ,//省份
            levelList:[],  //级别
            terminalList:[],  //终端
            orgArray:[], 
            orgArrayName:[],
            orgMount: false,
            initMount: false, //是否初始化终端
            isOrg:true,
        }
    },
    methods: {
        async getDepartment(){
            //加载监测中心
            await getCenterList(this);
            this.options = formatList(this.departmentList,1);
            this.departmentList = this.options;
        },
        //表单加载级联集合数据
       async loadOrgData(selectedOptions) {
           if(this.isOrg){
              await this.loadDepartmentData(this,selectedOptions);   
           }else{
              await this.loadDepartmentData_noOrg(this,selectedOptions);   
           }
       },  
       //级联查询
       async  loadDepartmentData(_that,selectedOptions) {             
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
        },

         //级联查询
       async  loadDepartmentData_noOrg(_that,selectedOptions) { 
              
            const targetOption = selectedOptions[selectedOptions.length - 1];
           // targetOption.loading = true;
            //点击的级别等于1 说明是监测中心查询省份
            console.info(targetOption);        
            if(targetOption.level == 1){
                
                let params = {
                    manageArea:targetOption.id
                }
                await getProvinceList(_that,params); 
                targetOption.children = formatListNoOrg(_that.provinceList,2);
        
            
            }else if(targetOption.level == 2){ 
                
                _that.defaultProvince = targetOption.value;
                let params = {
                    areaCode:targetOption.value
                    }
                await getLeveList(_that,params); 
                targetOption.children = formatListNoOrg(_that.levelList,3);
        
            }
           // targetOption.loading = false;
            _that.options = [..._that.options];
    },
        //初始化加载
       async initDepartmentData(_that,lodash){
            let  cascader_value = localStorage.getItem("cascader_value");
            let  cascader_options =   localStorage.getItem("cascader_options");
            
            if(cascader_value){
                    _that.orgArray = cascader_value.split(",");
                    _that.orgArrayName = cascader_options.split(",");
                    let clone = {
                        departMentId:_that.orgArray[0],
                        areaCode:_that.orgArray[1],
                        levelType:_that.orgArray[2],
                        orgId:_that.orgArray[3],
                    }
                    await getCenterList(_that);
                    _that.departmentList = formatList(_that.departmentList,1);
                    
                    console.info(_that.departmentList);
                    _that.defaultProvince = clone.areaCode;
                    //获取数据对应的部门数据
                    let manageAreaItem = _that.departmentList.find(function(item, index, arr){
                                if(item.value.indexOf(clone.departMentId)>=0){
                                    return true;
                                }
                    });
                    console.info(manageAreaItem);
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
      
      
    },
    mounted() {
        if(this.orgMount === true){
            this.getDepartment();
        }
        if(this.initMount === true){
            this.initDepartmentData(this,lodash);
        }
    }
}