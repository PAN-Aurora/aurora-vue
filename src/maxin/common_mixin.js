/**
 * 用于处理框架组件的函数
 */
import { POST,GET } from "@/utils/restful_util";
export const common_mixin = {
    data(){
        return{
            panelDown: false, // 折叠面板组件箭头控制flag
            exceptionReasonList:[],
            exceptionMount:true,
        }
    },
    methods:{
        panelClick(e) { // 折叠面板箭头控制
            if(e.length) {
                this.panelDown = true;
            }else {
                this.panelDown = false;
            }
         },
      
         //加载异常原因
        getHarmfulExceptionReasonList(){
            //异常原因
            this.exceptionReasonList =[];
            GET(this, "/javaApi/alarm.do?method=queryHarmfulExceptionReasonList", {}, res => {
                    if(res.code==1){
                        res.data.forEach(item =>{
                        let obj = {};
                        obj.value = item.harmfulAlarmExceptionReasonId;
                        obj.name = item.name;
                        this.exceptionReasonList.push(obj);
                    });
                }
             });
        },

    },
    mounted() {
        if(this.exceptionMount === true){
            this.getHarmfulExceptionReasonList();
        }
    }



}