<template>
    <div class="outer">
       <div class="row">
          <div class="ecllipse" @click="btnClick('Power')">
             <i class="fa fa-power-off icn" aria-hidden="true"></i>
          </div>
           <div class="ecllipse" style="float:right"  @click="btnClick('Silence')">
             <i class="fa fa-silence-right icn" aria-hidden="true"></i>
          </div>
       </div>
       <div class="row btnList" v-for="(row, idx) in btnList" :key="idx">
          <p v-for="(col, index) in row" :key="index" v-html="col.label" :class="col.className || ''"></p>
       </div>
       <div class="row">
          <div class="circle" @click="btnClick('Menu')">
             首页
          </div>
          <div class="circle" style="float:right">
             本地
          </div>
       </div>
       <div>
          <div class="bigCircle">
             <div class="innerCircle" @click="btnClick('Enter')">确定</div>
             <div class="top" @click="btnClick('Up')">
                <i class="fa fa-caret-up" aria-hidden="true"></i>
             </div>
             <div class="right" @click="btnClick('Right')">
                <i class="fa fa-caret-right" aria-hidden="true"></i>
             </div>
             <div class="bottom" @click="btnClick('Down')">
                <i class="fa fa-caret-down" aria-hidden="true"></i>
             </div>
             <div class="left" @click="btnClick('Left')">
                <i class="fa fa-caret-left" aria-hidden="true"></i>
             </div>
          </div>
       </div>
       <div class="row btList">
          <section>
             <ul>
                <li @click="btnClick('VolUp')">+</li>
                <li>音量</li>
                <li @click="btnClick('VolDown')">-</li>
             </ul>
          </section>
          <section>
             <div class="circle" style="margin-top:1em;margin-left:1em" @click="btnClick('ProgUp')">上页</div>
             <div class="circle" style="margin-top:1em;margin-left:1em" @click="btnClick('ProgDown')">下页</div>
          </section>
          <section>
             <ul>
                <li>+</li>
                <li>频道</li>
                <li>-</li>
             </ul>
          </section>
       </div>
        <div>
          <div class="circle">
             菜单
          </div>
          <div class="circle" style="float:right">
             返回
          </div>
       </div>
       <div class="row btnList" v-for="(row, idx) in numList" :key="`row_${idx}`">
          <p v-for="(col, index) in row" :key="index" v-html="col.label" :class="col.className || ''" @click="btnClick(col.type)"></p>
       </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            btnList: [
               [
                  {label: 'TV/AV'},
                  {label: '音量-'},
                  {label: '音量+'},
                  {label: '学习', className: 'bdn'}
               ],
               [
                  {label: '声道'},
                  {label: '设置'},
                  {label: '<i class="fa fa-refresh" aria-hidden="true"></i>'},
                  {label: '静音', className: 'bdn'}
               ],
               [
                  {label: '<i class="fa fa-backward" aria-hidden="true"></i>'},
                  {label: '<i class="fa fa-forward" aria-hidden="true"></i>'},
                  {label: '<i class="fa fa-play" aria-hidden="true"></i><i class="fa fa-pause" aria-hidden="true"></i>'},
                  {label: '<i class="fa fa-stop" aria-hidden="true"></i>', className: 'bdn'}
               ],
               // [
               //    {label: '', className: 'red'},
               //    {label: '', className: 'green'},
               //    {label: '', className: 'yellow'},
               //    {label: '', className: 'bdn blue'}
               // ]
            ],
            numList: [
               [
                  {label: '<span>1</span><sub>,.</sub>', type: 'One'},
                  {label: '<span>2</span><sub>ABC</sub>', type: 'Two'},
                  {label: '<span>3</span><sub>DEF</sub>', className:'bdn', type: 'Three'}
               ],
               [
                  {label: '<span>4</span><sub>GHI</sub>', type: 'Four'},
                  {label: '<span>5</span><sub>JKL</sub>', type: 'Five'},
                  {label: '<span>6</span><sub>MNO</sub>', type: 'Six', className:'bdn'}
               ],
               [
                  {label: '<span>7</span><sub>PQRS</sub>', type: "Seven"},
                  {label: '<span>8</span><sub>TUV</sub>', type: "Eight"},
                  {label: '<span>9</span><sub>WXYZ</sub>', type: "Nine", className:'bdn'}
               ],
               [
                  {label: '<span>*</span><sub>软键盘</sub>'},
                  {label: '<span>0</span>', type: "Zero"},
                  {label: '<span>#</span><sub>输入法</sub>', className:'bdn'}
               ]
            ]
        }
    },
    methods: {
      btnClick (type) {
         if (type) {
            this.$emit('remoteControl', type)
         }
      }
    },
    mounted () {
    }
}
</script>
<style lang="less" scoped>
@width: 45px;
@height: 25px;
@radius: 20px;
@red: #ff3f3e;
@boxShadow: 1px 2px 2px black;
@black: #2b2c32;
.top, .right, .bottom, .left{
   position: absolute;
   width: 20px;
   height: 20px;
   line-height: 20px;
   border-radius: 50%;
   text-align: center;
}
.top{
   top: 3%;
   left: 43%;
}
.left{
   top: 42%;
   left: 3%;
}
.right{
   top: 42%;
   right: 3%;
}
.bottom{
   left:43%;
   bottom: 3%;
}
.outer{
   height: 100%;
   background: url(../static/bk_remote.png) no-repeat;
   background-size: 100% 100%;
   width: 80%;
   margin: auto;
   padding: 0.5em 1.2em;
}
.row{
   margin: 1.2em auto 0 auto;
}
.btList{
   display: flex;
   height: 120px;
   flex-direction: row;
}
.btList section {
   flex:1;
   margin: 0;
}
.btList section ul{
   margin: 0 auto;
   padding: 0;
   list-style-type: none;
   border-radius: @radius;
   background-color: @black;
   height: 90%;
   width: 70%;
   color:white;
}
.btList section ul li{
   text-align: center;
   height: 40px;
   line-height:40px;
   text-align: center;
}
.ecllipse{
   width: @width;
   height: @height;
   text-align: center;
   line-height: @height;
   background-color: @red;
   border-radius: @radius;
   box-shadow: @boxShadow;
   display: inline-block;
   color: white;
}
.circle{
   width: 35px;
   height: 35px;
   line-height: 35px;
   text-align: center;
   background-color: @black;
   border-radius: 50%;
   color:white;
   display: inline-block;
   box-shadow: 0 0 2px black;
}
.bigCircle{
   margin: auto;
   width: 150px;
   height:150px;
   border-radius: 50%;
   background-color: @black;
   border:1px solid black;
   color: white;
   display: flex;
   justify-content: center;
   align-items: center;
   position: relative;
}
.innerCircle{
   width: 90px;
   height:90px;
   line-height:90px;
   text-align: center;
   border-radius: 50%;
   background-color: @black;
   border:3px solid black;
}
.icn{
   font-size: 16px;
}
.btnList{
   display: flex;
   border-radius: @radius;
   height: @height;
   background-color: @black;
   box-shadow: @boxShadow;
   width: 95%;
}
.btnList p{
   flex: 1;
   border-right: 2px solid black;
   padding: 0;
   height: @height;
   line-height: @height;
   text-align: center;
   margin: 0;
   color:white;
}

.red{
   background-color: #ff3e38;
   border-top-left-radius: @radius;
   border-bottom-left-radius: @radius;
}
.green{
   background-color: #00b96d;
}
.yellow{
   background-color: #e9e300;
}
.blue{
   background-color: #465bd2;
   border-top-right-radius: @radius;
   border-bottom-right-radius: @radius;
}
.bdn{
   border-right:none !important;
}

//active 
.btnList p:active {
   background-color: white;
   color: black;
}
.btnList p:first-child:active {
   background-color: white;
   color: black;
   border-top-left-radius:@radius;
   border-bottom-left-radius:@radius;
}
.btnList p:last-child:active {
   background-color: white;
   color: black;
   border-top-right-radius:@radius;
   border-bottom-right-radius:@radius;
}
.circle:active, .ecllipse:active, .innerCircle:active, .top:active , .right:active, .bottom:active, .left:active{
   background-color: white;
   color: black;
}
.btList section ul li:first-child:active{
   border-top-left-radius: @radius;
   border-top-right-radius: @radius;
   background-color: white;
   color: black;
}
.btList section ul li:last-child:active{
   border-bottom-left-radius: @radius;
   border-bottom-right-radius: @radius;
   background-color: white;
   color: black;
}
.btnList p:hover, .circle:hover, .ecllipse:hover, .innerCircle:hover, .top:hover, 
.right:hover, .bottom:hover, .left:hover, .btList section ul li:first-child:hover, .btList section ul li:last-child:hover{
   cursor: pointer;
}
</style>



