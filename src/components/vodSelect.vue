<template>
   <div>
        <!--点播 列表开始 -->
        <a-spin :spinning="spinning" v-if="vodListOption.show" >
            <a-row type="flex" justify="center" >
                <a-col :span="24">
                <label class="form_label">节目名称：</label>
                <a-input-search placeholder="请输入节目名称"
                style="width: 80%" 
                v-model="vodName"
                @search="onVodChange" />
                </a-col>
            </a-row>
        
        <!--一级分类 开始 -->
        <div style="margin:0px 0px;" v-if="categorys.length > 0">
            <a-divider style="font-size:10px;">一级分类</a-divider>
            <template v-for="(category, idx) in categorys">
            <a-tag :color="categoryColors[idx%categoryColors.length]" :style="{marginTop:'3px'}" @click="getSubCate(category.categoryCode, 1);getVodsByCate(category.categoryCode)" :key="category.categoryCode">{{category.categoryName}}</a-tag>
            </template>
            <a-tag color="#800000" @click="getAllVods(1)" v-if="categorys.length > 0">全部</a-tag>
        </div>
        <!--一级分类 结束 -->

        <!--二级分类 开始 -->
        <div style="margin:0px 0px;" v-if="secondCategorys.length > 0">
            <a-divider style="font-size:10px;">二级分类</a-divider>
            <template v-for="(category, idx) in secondCategorys">
            <a-tag :color="categoryColors[idx%categoryColors.length]" :style="{marginTop:'3px'}" @click="getSubCate(category.categoryCode, 2);getVodsByCate(category.categoryCode)" :key="category.categoryCode">{{category.categoryName}}</a-tag>
            </template>
            <a-tag color="#800000" @click="getAllVods(2)" v-if="secondCategorys.length > 0">全部</a-tag>
        </div>
        <!--二级分类 结束 -->

        <!--三级分类 开始 -->
        <div style="margin:0px 0px;" v-if="thirdCategorys.length > 0">
            <a-divider style="font-size:10px;">三级分类</a-divider>
            <template v-for="(category, idx) in thirdCategorys">
            <a-tag :color="categoryColors[idx%categoryColors.length]" :style="{marginTop:'3px'}" @click="categoryCode = category.categoryCode;getAllVods(4)" :key="category.categoryCode">{{category.categoryName}}</a-tag>
            </template>
            <a-tag color="#800000" @click="getAllVods(3)" v-if="secondCategorys.length > 0">全部</a-tag>
        </div>
        <!--三级分类 结束-->

        <!-- 点播节目 开始 -->
        <a-list :dataSource="vodList" :split="false" :pagination="pagination">
            <div slot="renderItem" slot-scope="item, index" >
            <a-list-item   class="panelCss" v-if="item.episode == 1" style="padding: 0px 0px;margin: 2px 0px;" >
                <a href ="javascript:return false;" style="color: #2db7f5;margin-left: 10px">
                    {{item.vodName}}
                    <a-button v-if="item.isSelect == 0 "  class="success"  type="primary" icon="plus-circle" size="small" style="margin:2px 2px;" @click="addProgrameBatch(item,1)"/>
                    <a-button v-if="item.isSelect == 1 " class="dark_btn_stop" type="primary" icon="minus-circle" size="small" style="margin:2px 2px;" @click="delPrograme(item,1)" /> 
                </a>
            </a-list-item>
            <a-collapse class="spanCss" v-if="item.episode != 1" :activeKey="item.activeKey" accordion style="background-color: transparent;margin: 0px 0px;padding: 0px 0px; " :bordered="false"  @change="changeCollapse">
                    <a-collapse-panel :key="item.vodCode" :showArrow="false"  style="margin: 0px 0px; overflow-y: auto;max-height: 300px;border: 0;padding: 0px 0px;">
                    <span slot="header" style="color: #2db7f5;padding: 0px 0px;margin: 0px 0px;"  >
                        {{item.vodName}} <a-icon type="right" v-if="item.activeKey != item.vodCode"  /><a-icon type="up" v-if="item.activeKey == item.vodCode"/>
                    </span>
                    <ul class="licss" style="padding: 0px 0px;margin: 0px 0px;list-style:none;background-color: rgb(240,240,240);">
                        <li v-for="subItem in item.children" :key="subItem.vodCode">
                            <a href ="javascript:return false;" style="color: #2db7f5;"  >
                                    {{subItem.vodName}}
                                <a-button v-if="subItem.isSelect == 0 "  class="success"  type="primary" icon="plus-circle" size="small" style="margin:2px 2px;" @click="addProgrameBatch(subItem,2)"/>
                                <a-button v-if="subItem.isSelect == 1 " class="dark_btn_stop" type="primary" icon="minus-circle" size="small" style="margin:2px 2px;" @click="delPrograme(subItem,2)" />
                            </a>
                        </li>
                    </ul>
                    </a-collapse-panel>
            </a-collapse>

                </div>
        </a-list>
        <!-- 点播节目 结束 -->
        </a-spin>
    <!--点播 列表结束 -->
   </div>
</template>
<script>
export default {
  props: {
      vodListOption: {
            type: Object,
            required: true,
      }
  },
  computed: {
    
  },
  created() {
    
  },
  data() {
    return {
        orgId:'',
        categoryColors:['#2db7f5','#87d068','#108ee9'], // 节目类型tag标签颜色
        categorys:[], // 根分类数组
        secondCategorys: [], // 二级节目类型数组
        thirdCategorys: [], // 三级节目类型数组
        expFlag: false, // 迭代查询标识，false表示不进行迭代查询，用于分页时选择查询函数
        vodName:'', //点播名称
        curCategoryCode: { // 当前节目类型级别对象
            first: '',  // 一级
            second: '' // 二级
        },
        categoryCode:'',
        spinning:false,
        dataList: [],
        vodList: [], // 点播节目数组
        vodSelectList:[],//选择的节目数组
        pagination: { // 分页参数
                current: 1,
                pageSize: 10,
                total:0,
                size: "small",
                onChange: page =>{
                        this.pagination.current = page;
                        if(this.expFlag){
                            this.getVodsExp();
                        }else{
                            this.getVods();
                        }
                    
                },
                showTotal: function(total){
                        return "共"+total+"条"
                }
        },
    };
  },
  methods: {
        init(){
            console.info(this.vodListOption);
            if(this.vodListOption.orgId){
                this.orgId = this.vodListOption.orgId;
            }
             if(this.vodListOption.vodSelectList){
                 this.vodSelectList = this.vodListOption.vodSelectList;
            }
            if(this.vodListOption.pagination){
                Object.assign(this.pagination, this.vodListOption.pagination);
            }  
            this.getCategorys();
        },
        //点播一级分类
        getCategorys(){ // 查询根分类
            
            this.GET(this, "/javaApi/monitorVod.do?method=rootCategoty", {orgId:this.orgId}, res => {
            
                if(res.code==1){
                    this.categorys = res.data.list
                }
            });
        
            this.getAllVods(1);
        },
       // 按名称搜索节目
        onVodChange() { 
            this.pagination.current = 1;
            this.getVods();
        },
         //增加批量下发节目或者频道
        addProgrameBatch(item,type){
                  if(type==1){
                    ///增加时修改状态 
                    for (let i = 0; i < this.vodList.length; i++) {
                        if (this.vodList[i].vodCode == item.vodCode
                        && this.vodList[i].episode == item.episode
                        ) {
                            this.vodList[i].isSelect = 1; 
                            
                        }
                       
                    }
                    item.type = 1; 
                }else{
                     
                    ///增加时修改状态 
                    for (let i = 0; i < this.vodList.length; i++) {
                         for(let j=0; j< this.vodList[i].children.length;j++){
                            if (this.vodList[i].children[j].vodCode == item.vodCode
                                && this.vodList[i].children[j].episode == item.episode
                                ) {
                                    this.vodList[i].children[j].isSelect = 1; 
                                    
                                }
                         }
                        
                    }
                    item.type = 2; 
                }
              this.vodSelectList.push(item);
              this.$emit('setVodSelectList',this.vodSelectList);  
            }, 
              //增加点播节目
            addPrograme(item,type){
                console.info(item);
                 if(this.vodSelectList.length>0){
                        for (let i = 0; i < this.vodSelectList.length; i++) {
                            if (this.vodSelectList[i].vodCode != item.vodCode) {
                                   this.$message.error('只支持同一节目下不同集数的任务！');
                                  return false;
                            }
                       }
                        this.vodSelectList.push(item);
                    }else{
                        this.vodSelectList.push(item);
         
                    }
                   
                if(type==1){
                   
                    ///增加时修改状态 
                    for (let i = 0; i < this.vodList.length; i++) {
                        if (this.vodList[i].vodCode == item.vodCode
                        && this.vodList[i].episode == item.episode
                        ) {
                            this.vodList[i].isSelect = 1; 
                            
                        }
                    }
                    item.type = 1; 
                }else{
                     
                    ///增加时修改状态 
                    for (let i = 0; i < this.vodList.length; i++) {
                         for(let j=0; j< this.vodList[i].children.length;j++){
                            if (this.vodList[i].children[j].vodCode == item.vodCode
                                && this.vodList[i].children[j].episode == item.episode
                                ) {
                                    this.vodList[i].children[j].isSelect = 1; 
                                    
                                }
                         }
                        
                    }
                     item.type = 2; 
                }
               
                
            },
            //减少点播节目
            delPrograme(item,type){
                for (let i = 0; i < this.vodSelectList.length; i++) {
                    if (this.vodSelectList[i].vodCode == item.vodCode
                     && this.vodSelectList[i].episode == item.episode
                    ) {
                        this.vodSelectList.splice(i, 1); 
                        i--;
                    }
                }
                 if(type==1 || item.type==1){
                
                    for (let i = 0; i < this.vodList.length; i++) {
                            if (this.vodList[i].vodCode == item.vodCode
                            && this.vodList[i].episode == item.episode
                            ) {
                                this.vodList[i].isSelect = 0; 
                                
                            }
                        }
                }else{
                   
                    for (let i = 0; i < this.vodList.length; i++) {
                         for(let j=0; j< this.vodList[i].children.length;j++){
                            if (this.vodList[i].children[j].vodCode == item.vodCode
                                && this.vodList[i].children[j].episode == item.episode
                                ) {
                                    this.vodList[i].children[j].isSelect = 0; 
                                    
                                }
                         }
                        
                    }
                }
                this.$emit('setVodSelectList',this.vodSelectList);  
            },
             // 查询点播节目
            async  getVods() {
                this.expFlag = false;

                if(!this.orgId || this.orgId == ''){
                this.$message.warning('请选择所属终端！');
                this.categoryCode = '';
                this.vodName = '';
                return;
                }

                let trans = {};
                trans.orgId = this.orgId;
                trans.start = this.pagination.current;
                trans.limit = this.pagination.pageSize;

                if(this.vodName.trim() != '') {
                trans.vodName = this.vodName;
                }
                if(this.categoryCode != ''){
                trans.categoryCode = this.categoryCode;
                }
                await  this.GET(
                this,
                "/javaApi/monitorVod.do?method=vodList",
                trans,
                res => {
                    this.vodList = this.getEpisode(res.data.list);
                    this.pagination.total = res.data.totalCount;
                }
                );
                
            },
            // 根据父类查询子类
            async  getSubCate(categoryCode, level){ 
                if(level > 2) {
                   return;
                }
                let url = '/javaApi/monitorVod.do?method=childCategoty';
                let trans = {
                orgId: this.orgId,
                parentCategory: categoryCode
                }
             await   this.GET(this, url, trans, res=> {
                if(level == 1) {
                    if(res.data && res.data.list){
                    
                    this.secondCategorys = res.data.list;
                    }else{
                    this.secondCategorys = [];
                    }
                    this.thirdCategorys = [];
                    this.curCategoryCode.first = categoryCode;
                }else{
                    if(res.data && res.data.list){
                    this.thirdCategorys = res.data.list;
                    }else{
                    this.thirdCategorys = [];
                    }
                    this.curCategoryCode.second = categoryCode;
                }
                }); 
            
            },
            // 根据类别查询节目
            getVodsByCate(categoryCode) { 
                this.categoryCode = categoryCode;
                this.pagination.current = 1;
                this.vodName = '';
                this.getVods();
            },
            // 查询当前级别所有类型频道
            getAllVods(level) { 
                this.vodName = '';
                this.pagination.current = 1;
                switch(level) {
                case 1: // 一级类型节目：清除二级、三级类型数组，不使用类型查询条件
                    this.categoryCode = '';
                    this.secondCategorys = [];
                    this.thirdCategorys = [];
                    this.getVods();
                    break;
                case 2: // 二级类型节目：清除三级数组，使用选中的一级类型作为查询条件
                    this.categoryCode = this.curCategoryCode.first;
                    this.thirdCategorys = [];
                    this.getVodsExp();
                    break;
                case 3: // 三级类型节目：使用选中的二级类型作为查询条件
                    this.categoryCode = this.curCategoryCode.second;
                    this.getVodsExp();
                    break;
                case 4:
                    this.getVodsExp();
                    break;
                }
            },
            //二三四级类的节目查询
            getVodsExp(){
                    this.expFlag = true;
                    if(!this.orgId || this.orgId == ''){
                    this.$message.warning('请先选择前端');
                    this.categoryCode = '';
                    this.vodName = '';
                    return;
                    }
                    let trans = {};
                    trans.orgId = this.orgId;
                    trans.start = this.pagination.current;
                    trans.limit = this.pagination.pageSize;
                    if(this.vodName.trim() != '') {
                    trans.vodName = this.vodName;
                    }
                    if(this.categoryCode != ''){
                    trans.categoryCode = this.categoryCode;
                    }
                    this.GET(
                    this,
                    "/javaApi/monitorVod.do?method=vodListExp",
                    trans,
                      res => {
                        this.vodList = this.getEpisode(res.data.list);
                        this.pagination.total = res.data.totalCount;
                      }
                    );
            },
            // 根据集数将单一节目进行拆分
            getEpisode(list){
                for(let i = 0; i < list.length; i++) {
                    list[i].activeKey ='';
                    if(list[i].episode != 1){
                        let episode = list[i].episode; //集数
                        list[i].children = new Array(episode);
                    
                        for(let j = 0; j < episode; j++){
                            try{
                                list[i].children[j] = {};
                                if(this.vodSelectList.length > 0){
                    
                                        for (let k = 0; k < this.vodSelectList.length; k++) {
                                                if (this.vodSelectList[k].vodCode == list[i].vodCode
                                                && this.vodSelectList[k].episode == j
                                                ) {
                                                    console.info(list[i].children[j]);
                                                      list[i].children[j].isSelect = 1;
                                                    break;
                                                }else{
                                                    list[i].children[j].isSelect = 0;
                                                }
                                            }
                                    }else{
                                            list[i].children[j].isSelect = 0;
                                    }
                                
                                list[i].children[j].vodName = list[i].vodName + '第' + (j+1) + '集';
                                list[i].children[j].vodCode = list[i].vodCode;
                                list[i].children[j].orgId = list[i].orgId;
                                list[i].children[j].episode = j+1;
                            }catch(e){
                                console.log(e);
                        }

                    }
                  }
                if(this.vodSelectList.length > 0){
                    console.info(this.vodSelectList);
                    for (let j = 0; j < this.vodSelectList.length; j++) {
                            if (this.vodSelectList[j].vodCode == list[i].vodCode
                            && this.vodSelectList[j].episode == list[i].episode
                            ) {
                                console.info(list[i]);
                                list[i].isSelect = 1; 
                                break;
                            }else{
                                list[i].isSelect = 0; 
                            }
                        }
                }else{
                          list[i].isSelect = 0; 
                }
                
            }
            console.info(list);
            return list;
        },
      
     
        changeCollapse(key){
                console.info(key);
                if(key){
                    for (let i = 0; i < this.vodList.length; i++) {
                    if (this.vodList[i].vodCode == key) {
                           this.vodList[i].activeKey = key;
                            
                        }else{
                            this.vodList[i].activeKey = '';
                        }
                    }
                }else{
                   for (let i = 0; i < this.vodList.length; i++) {
                          this.vodList[i].activeKey = '';
                      }
                }
            
        },
  },
  components: {
    
  }
};
</script>
<style lang="less" scoped>
 
</style>
