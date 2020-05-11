<template>
  <div id="app">
    <a-locale-provider :locale="locale">
      <router-view></router-view>
    </a-locale-provider>
  </div>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import { generateMenus } from "@/utils/object_util";
import { appRouter } from "@/router/router";
export default {
  data() {
    return {
      locale: zhCN
    };
  },
  name: "app",
  created() {
    const token = this.$ls.get("userToken");
    const resMenu = JSON.parse(this.$ls.get("resMenu"));
    if (token) {
      const menus = generateMenus(this, resMenu, appRouter);
      this.$store.commit("updateMenulist", []);
      this.$router.addRoutes(menus.addRoutes);
      this.$store.commit("updateMenulist", menus.menu);
      this.$store.dispatch("getBaseData");
      
      this.$store.commit("setOpenKeys", JSON.parse(sessionStorage.getItem("openKeys")));  // 刷新初始化菜单展开项
      if(sessionStorage.getItem("selectedKeys")){
        this.$store.commit("setMenuActiveKey", JSON.parse(sessionStorage.getItem("selectedKeys")));   // 刷新初始化菜单选中项
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  overflow: hidden;
}
</style>
