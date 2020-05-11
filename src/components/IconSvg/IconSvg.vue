<template>
  <svg :class="sc" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    svgName: {
      type: String,
      required: true
    },
    svgClass: {
      type: String,
      default: ""
    }
  },
  computed: {
    iconName() {
      return `#${this.svgName}`;
    },
    sc() {
      if (this.svgClass) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    }
  }
};
</script>

<style scoped>
.svg-icon {
  width: 100%;
  height: 100%;
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>