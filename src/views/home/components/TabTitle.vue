<template>
  <div class="tab-content">
    <div class="wrapper">
      <a-icon type="left-circle" @click="lastPageData"/>
      <div class="main">
          <div class="flex-a">
              <div class="tabs">
                  <a
                  v-for="(item, index) in tabsData"
                  :key="index"
                  href="javascript:void(0)"
                  @click="switchTab(item, index)"
                  :class="currentIndex == index ? 'current' : 'currentWait'"
                >{{item.name}}</a>
              </div>
          </div>
        </div>
      <a-icon type="right-circle" @click="nextPageData"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "tabTitle",
  components: {
    
  },
  props: {
    frontId:null,
    platformType: null,
    default: null
  },
  data() {
        return {
            currentIndex:0,
            page:1,
            pageSize:4,
            totalpage:1,
            tabsData:[],
        }
  },
  mounted (){
     this.init();
  },
  methods: {
    async init(){
        let data_res = await this.Request.get(this, "/javaApi/pagestatistics.do?method=FindChannelCateGory",  {
            params: {
                areaCode:this.areaCode,
                frontId: this.frontId,
                platformType: this.platformType,
                page :this.page,
                pageSize:this.pageSize
            }
        });
        if(data_res.total>0){
            this.tabsData =   data_res.list;
            this.tabsData.forEach(element => {
                   if(element.name.length>2){
                        element.name = element.name.substring(0,element.name.length-2);
                   }
            });
           this.$emit("tabchange", this.tabsData[0].name, this.currentIndex);   
           this.totalpage = parseInt(data_res.total/this.pageSize);
           let num =  data_res.total%this.pageSize;
           if(num > 0){
              this.totalpage++;
            }

        }
      

    },
    async switchTab(item, index) {
          this.currentIndex = index;
          this.$emit("tabchange", item.name, index);   
    },
    lastPageData(){
      if(this.page > 1){
          this.currentIndex = 0;
          this.page =  this.page - 1;
          this.init();
      }
    },
    nextPageData(){
      if(this.page < this.totalpage){
          this.page =  this.page + 1;
          this.currentIndex = 0;
          this.init();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  padding: 2px 2px;
  display: flex;
  white-space:nowrap;
  justify-content: space-between;
  align-items: center;
  .anticon {
    font-size: 22px;
    color: #a4aac0;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      color: #fff;
    }
  }
}
.pagination-container {
  font-size: 14px;
  color: #a4aac0;
  text-align: center;
  line-height: 20px;
  b {
    font-size: 16px;
    color: #fff;
  }
}
.flex-a {
  margin: 0px 0px;
  display: flex;
  align-items: center;
  height: 10px;
  .tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      text-decoration: none;
      &:not(:first-of-type) {
        margin-left: 2px;
      }
      color: #a4aac0;
      font-size: 14px;
      padding: 6px 6px;
      transition: all 0.2s;
      line-height: 16px;
      height: 28px;
      border-bottom: 1px solid rgba(47, 177, 205, 0);
      &:hover {
        color: #fff;
      }
    }
    .current {
        background: rgba(88,104,217, 1);
        border: 1px solid rgba(88,104,217, 1);
        position: relative;
        color: #fff;
        &:after {
            content: "";
            width: 60%;
            position: absolute;
            left: 20%;
            bottom: 0;
            height: 2px;
            background: rgba(47, 177, 205, 1);
        }
    }
      .currentWait {
        background: rgba(30,36,85, 1);
        border: 1px solid rgba(88,104,217, 1);
        color: #ffffff;
    }
}
}
</style>