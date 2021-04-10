<template>
  <a-layout id="content">
    <leftMenu @switch="switchPage"></leftMenu>
    <a-layout>
      <a-layout-header class="header">
        <a-row type="flex">
          <a-col span="21">
            <div class="logo"></div>
            <h1>Ant Design of Vue</h1>
          </a-col>
          <a-col span="3">
            <div class="icons-list">
              <!-- <a-badge :dot="showBadge">
                <a-avatar icon="bell" style="background-color: #ffae00" />
              </a-badge> -->
              <!-- <a-icon type="bell" style="background-color: #ffae00;font-size=20px"/> -->
              <!-- <a-divider type="vertical" /> -->
              <a-popover placement="bottomRight">
                <template slot="content">
                  <a-button @click="logout">登出</a-button>
                </template>
                <i class="fa fa-user-circle-o fa-2x" aria-hidden="true"></i>
                <label for="" style="margin-left:10px;font-size:16px;">{{userName}}</label>
              </a-popover>
            </div>
          </a-col>
        </a-row>
      </a-layout-header>
      <div class="bread" hidden>
        <div class="hisLeft">
          浏览记录
          <a-icon type="double-right" />
        </div>
        <div class="bread" style="width:90%">
          <p
            v-for="(item, idx) in history"
            :class="idx == currentIndex ? 'menuSelected' : ''"
            :key="idx"
            @click="navigateTo(item, idx)"
          >
            <a-icon type="tag" v-if="idx == currentIndex" />
            <span>{{item.label}}</span>
            <a-icon class="icn" type="close" @click="removeRecord(idx)" />
          </p>
        </div>
        <div class="hisLeft" @click="clearHistory">清空历史</div>
      </div>
      <a-config-provider>
    <template v-slot:renderEmpty>
      <div style="text-align: center">
        <p style="color: lightgray">暂无数据</p>
      </div>
    </template>
      <a-layout-content class="bkStyle" style="padding:16px">
        <router-view></router-view>
      </a-layout-content>
      </a-config-provider>
    </a-layout>
  </a-layout>
</template>
<script>
import leftMenu from "../components/menu.vue";
export default {
  data() {
    return {
      showBadge: true,
      collapsed: false,
      history: [],
      currentIndex: 0
    };
  },
  computed: {
    userName () {
      return sessionStorage.getItem('realName') ? sessionStorage.getItem('realName') : ''
    }
  },
  methods: {
    logout() {
      this.$ls.remove('userToken');// 清除token
      this.$ls.remove('resMenu'); // 清除权限菜单缓存

      sessionStorage.clear();
      this.$store.commit("removeMenuActiveKey");
      this.$store.commit("removeOpenKeys");
      this.$router.push({path: '/login'});
    },
    removeRecord(index) {
      this.history.splice(index, 1);
    },
    switchPage(item) {
      if (this.history.length == 10) {
        this.history.shift();
      }
      let index = _.findIndex(this.history, { label: item.label });
      if (index !== -1) {
        let spliceItem = this.history.splice(index, 1)[0];
        this.history.push(spliceItem);
      } else {
        this.history.push(item);
      }
      this.currentIndex = this.history.length - 1;
    },
    clearHistory() {
      this.history = [];
      this.currentIndex = 0;
    },
    navigateTo(menu, idx) {
      this.currentIndex = idx;
      this.$router.push({ path: menu.path });
      // this.$router.go({path: menu.path})
    }
  },
  components: {
    leftMenu
  }
};
</script>
<style scoped lang="less">
@iconSize: 20px;
@headBk: #3c4148;
@zero: 0;
@white: #fff;
@em1: 0.8em;
@em2: 2em;
@full: 100%;
.logo {
  width: 45.38px;
  height: 30px;
  border-radius: 5px;
  margin: 1em;
  background-image: url(../assets/logoSys.png);
  background-size: 100% 100%;
  float: left;
}
.bread {
  border-bottom: 1px solid lightgrey;
  display: flex;
  text-align: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  white-space: nowrap;
}
.bread p {
  margin: 3px;
  border: 1px solid lightgrey;
  padding: 2px 5px;
}
.bread p:hover {
  cursor: pointer;
}
.bread p a {
  margin-right: 5px;
}
.hisLeft {
  height: 100%;
  border-right: 1px solid lightgrey;
  padding: 6px;
  background-color: #dadcdf;
  width: 5%;
}
.hisLeft:hover {
  cursor: pointer;
}
.rightIcon {
  margin-left: @em2;
}
.header {
  background-color: @headBk;
  padding: @zero;
  color: @white;
}
.icn:hover {
  cursor: pointer;
  color: #e6a23c;
}
h1 {
  color: @white;
  margin-left: @em1;
}
#content {
  height: @full;
}
.menuSelected {
  background-color: #30b08f;
  color: white;
}
.icons-list{
  display: flex;
  justify-content: center;
  align-items: right;
  height: 80%;
}
.bkStyle { // 设置背景
  //background: url(../assets/background.png);
  background-size: contain;
  min-height: '280px';
  overflow-x: hidden;
  //min-height: 100%;
}
</style>