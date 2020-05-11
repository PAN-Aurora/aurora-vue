import Vue from "vue";
import IconSvg from "@/components/IconSvg/IconSvg.vue";

Vue.component("icon-svg", IconSvg);
const req = require.context("./svg", true, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);