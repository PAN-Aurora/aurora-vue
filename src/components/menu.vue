<template>
  <a-layout-sider :trigger="null" collapsible v-model="collapsed" id="leftSide">
    <h3 class="topHeader">
      <a-icon
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="toggleCollapsed"
      />
      <span v-show="!collapsed"></span>
    </h3>
    <a-menu
      theme="dark"
      mode="inline"
      @select="menuSelect"
      :openKeys="openKeys"
      @openChange="onOpenChange"
      :selectedKeys="selectedKeys"
    >
      <a-menu-item v-for="firstItem in firstMenu" :key="firstItem.path">
        <a-icon :type="firstItem.iconType" />
        <span>{{firstItem.title}}</span>
      </a-menu-item>
      <a-sub-menu v-for="item in subMenu" :key="item.path">
        <span slot="title">
          <a-icon :type="item.iconType" />
          <span>{{item.title}}</span>
        </span>
        <a-menu-item v-for="subItem in item.children" :key="subItem.path">
          <a-icon :type="subItem.iconType" />
          {{subItem.title}}
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "leftMenu",
  data() {
    return {
      collapsed: false,
      rootSubmenuKeys: []
    };
  },
  computed: {
    firstMenu: function() {
      return this.menuList.filter(router => {
        return router.redirect !== undefined;
      });
    },
    subMenu: function() {
      return this.menuList.filter(router => {
        return router.redirect === undefined;
      });
    },
    selectedKeys() {
      return this.$store.state.app.menuActiveKey;
    },
    openKeys() {
      return this.$store.state.app.openKeys;
    },
    ...mapGetters(["menuList"])
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    menuSelect(item) {
      this.$router.push(item.key);
      this.$emit("switch", {
        label: item.domEvent.target.innerText,
        path: item.key
      });
      this.$store.commit("setMenuActiveKey", [item.key]);
      sessionStorage.setItem("selectedKeys", JSON.stringify([item.key]));
    },
    onOpenChange(openKeys) {
      const keys = openKeys.length > 1 ? [openKeys.pop()] : openKeys;
      this.$store.commit("setOpenKeys", keys);
      sessionStorage.setItem("openKeys", JSON.stringify(keys));
    }
  },
  mounted() {},
  watch: {
    $route: {
      immediate: true, // 一旦监听到路由的变化立即执行
      handler(to,from) { // 回调函数，两个参数，to：当前的组件，from：上一个组件
        this.$store.commit("setMenuActiveKey", [to.path]);
        sessionStorage.setItem("selectedKeys", JSON.stringify([to.path]));
      }
    }
    /*$route(to, from) { // 主要用于返回时设置菜单的当前项与路由匹配
      this.$store.commit("setMenuActiveKey", [to.path]);
      sessionStorage.setItem("selectedKeys", JSON.stringify([to.path]));
    }*/
  }
};
</script>

<style scoped lang="less">
@darkBlue: #1d2531;
@white: #fff;
@zero: 0;
.ant-layout-sider {
  background-color: @darkBlue;
}
.ant-menu-dark {
  // background-color: #101726;
}
#leftSide {
  height: 100%;
}
#leftSide .trigger {
  font-size: 18px;
  line-height: 63px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#leftSide .trigger:hover {
  color: #1890ff;
}

#leftSide .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.topHeader {
  color: @white;
  margin-bottom: @zero;
}
</style>
