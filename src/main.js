import Vue from 'vue'
import VueCookie from 'vue-cookies'
import App from './App.vue'
import Antd from 'ant-design-vue'
import axios from 'axios'
import lodash from 'lodash'
import vuels from 'vue-ls'
import hls from 'hls.js'
import g2 from '@antv/g2'
import 'ant-design-vue/dist/antd.css'
import 'animate.css/animate.min.css'
import 'font-awesome/css/font-awesome.min.css'
import { router } from './router/index'
import { store } from './store'
import {appRouter} from './router/router'
import './icons/index'
import request from './utils/request.js'
import * as  hasPermission from './utils/btn.js'
import echarts from 'echarts'
import moment from 'moment'
import {warning, info} from '@/utils/alert_util'
import { POST,GET } from '@/utils/restful_util';
//覆盖样式
import './customStyle/darkStyle.less'

let count = 1
const lsOptions = {
    namespace: 'vuejs__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local', // storage name session, local, memory
};

Vue.config.productionTip = false

// axios 全局拦截，并在header中添加token信息
axios.interceptors.request.use(
    config => {
        let token = Vue.ls.get("userToken")
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        //config.headers['Authorization'] = 'Bearer ' + token;
        if(token){
            config.headers['Authorization'] ="Bearer "+ token;

        }else{
            config.headers['Authorization'] ="Bearer ";
        }
        //判断是否存在ticket，如果存在的话，则每个http header都加上ticket

        // if (token) {
            //用户每次操作，都将cookie设置成1小时
            // window.$cookies.set('user', token, '60MIN');
            // config.headers.token = token
        // }
        return config;
    },
    error => {

        return Promise.reject(error.response);
    });

// http response 拦截器,如果token出错，则跳转到登录页面
axios.interceptors.response.use(response => {

    let data = response.data
    //更新token值
    if(response.headers.authorization && response.headers.authorization!=""){
        Vue.ls.set("userToken", response.headers.authorization, 12*60*60*1000);
    }
    if (!data.code || data.code !== -5) {//token出错状态为-5
        
        return response;
    }
    if (data.code && data.code === -5) { //token出错状态为-5
        Vue.ls.remove('userToken')
        router.push({path: '/login'})
    }
    return Promise.reject(data)
}, error => {
    return Promise.reject(error)
})

/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
    if (store.state.app.debugMode) {
        setTimeout(()=>{
            if (count == 1) {
                store.commit('updateMenulist', appRouter)
                router.addRoutes(appRouter)
                count ++
            }
            next()
        },100)
        next ()
    } else {
        const token = Vue.ls.get('userToken')
        if (to.path == '/login') {
            token ? next({ path: '/' }) : next()
        } else {
            token ? next() : next({ path: '/login' })
        }
    }
});

Vue.use(request)
Vue.use(Antd)
Vue.use(VueCookie)
Vue.use(vuels, lsOptions)
Vue.use(hasPermission)
Vue.prototype.$axios = axios;
Vue.prototype.$hls= hls;
Vue.prototype.$g2= g2;
Vue.prototype.$echarts= echarts
Vue.prototype.$moment = moment;
Vue.prototype.$lodash = lodash;

Vue.prototype.$warning = warning;
Vue.prototype.$info = info;
Vue.prototype.POST = POST;
Vue.prototype.GET = GET;

new Vue({
    router: router,
    store,
    render: h => h(App),
}).$mount('#app')
