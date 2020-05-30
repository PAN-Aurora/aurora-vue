import Vue from 'vue'

//自定义指令
const hasPermission = Vue.directive('hasPermission',{
        bind:function(el,bingind,vnode){
            let btnPermissions = [];
              btnPermissions =   sessionStorage.getItem("btnPermission");
             if(!Vue.prototype.$_has(btnPermissions,bingind.value)){
                vnode.elm.hidden = true;
             }    
        }
})

//判断是否有权限
Vue.prototype.$_has = function(btnPermissions,value){
        let isHave = false;
        if(btnPermissions == undefined || btnPermissions == null){
            return false;
        }
        if(btnPermissions.indexOf(value)>-1){
            isHave = true;
        }
        return isHave;
}

