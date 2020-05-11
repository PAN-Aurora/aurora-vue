<template>
  <div class="tabs">
    <a
      v-for="(item, index) in tabs"
      :key="index"
      href="javascript:void(0)"
      @click="switchTab(item, index)"
      :class="currentIndex == index ? 'current' : 'currentWait'"
    >{{item.name}}</a>
  </div>
</template>

<script>
export default {
  name: "tabs",
  props: {
    tabs: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentIndex: 0
    };
  },
  methods: {
    switchTab(item, index) {
      this.currentIndex = index;
      this.$emit("switchTab", item, index);
    }
  }
};
</script>

<style lang="less" scoped>
.tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      text-decoration: none;
      &:not(:first-of-type) {
        margin-left: 4px;
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
</style>