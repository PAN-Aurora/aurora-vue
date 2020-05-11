<template>
  <div class="tab-content">
    <div class="wrapper">
      <a-icon type="left-circle" @click="lastPage"/>
      <div class="main">
        <div class="flex-a">
          <div v-for="(item, index) in channels" :key="index" @click="channelSelect(item.channelId)" :title="item.name">{{item.name}}</div>
        </div>
      </div>
      <a-icon type="right-circle" @click="nextPage"/>
    </div>
    <div class="pagination-container" >
      <div>
        <b>{{curpage}}</b>/{{totalpage}} ({{total}})
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from "./Tabs";
export default {
  name: "tab-content",
  components: {
    Tabs
  },
  props: {
    channels: Array,
    curpage: Number,
    totalpage: Number,
    total: Number,
    default: null
  },
  methods: {
    channelSelect(channelId){
      this.$emit('channelSelect', channelId);
    },
    lastPage(){
      if(this.curpage > 1){
        this.$emit('pagechange', this.curpage - 1);
      }
    },
    nextPage(){
      if(this.curpage < this.totalpage){
        this.$emit('pagechange', this.curpage + 1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  padding: 10px 2px;
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
  margin: 0 6px;
  display: flex;
  align-items: center;
  height: 120px;
  justify-content: space-between;
  flex-wrap: wrap;
  div {
    cursor: pointer;
    padding-left: 10px;
    width: 48.5%;
    line-height: 30px;
    font-size: 14px;
    color: #a4aac0;
    white-space: no-wrap;
    transition: all 0.2s;
    text-align: center;
    margin: 1.5% 0;
    &:nth-child(2n) {
      margin-left: 3%;
    }
    &:hover {
      background: #292f47;
      color: #fff;
    }
  }
}
</style>