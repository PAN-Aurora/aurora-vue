<template>
    <div class="container">
        <a-row type="flex" :gutter="16">
            <a-col :xs="24" :xxl="6">
                <div class="sub-container">
                    <div class="section-container flex-col-double">
                        <div class="block-a">
                            <img src="../../assets/title1.png"/>
                            <!-- <div class="title"></div> -->
                            <div class="content">
                                <a-list :grid="{ gutter: 16, xs: 2, lg:4, xxl:2}" :dataSource="data_summary">
                                    <a-list-item
                                            slot="renderItem"
                                            slot-scope="item"
                                            style="font-size:15px;;color:#c6cce6"
                                    >

                                        {{item.label}}:
                                        <b style="font-size:14px;color:#fff" ><a slot="title" href="#" @click="clickToPage(item.path,item.params)"  style="color: #5DADEA;text-decoration:underline;">{{item.value}} </a></b>&nbsp;个
                                    </a-list-item>
                                </a-list>
                            </div>
                        </div>

                        <div class="block-c">
                            
                            <div >
                                <!-- <div>全国数据趋势变化图</div> --> 
                                <div class="ui-btns">
                                    <img src="../../assets/title2.png"/>
                                    <a href="javascript:void(0)" :class="live?'current':'currentWait'"  @click="switchLive" >直播</a>
                                    <a href="javascript:void(0)" :class="vod?'current':'currentWait'"  @click="switchVod">点播</a>
                                </div>
                            </div>
                            <LineEchart  ref="tabLineEchart"></LineEchart>
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col class="middle-section" :xs="24" :xxl="12">
                <div class="block-e">
                    <!-- <div class="title">监测区域（全国）</div> -->
                    <img src="../../assets/title5.png"/>
                    <div class="content" >
                        <!--<div style="float: right; width: 40px;height: 30px; margin-left: 50px;">
                            <a-button type="primary" icon="undo" ghost>返回</a-button>
                        </div>-->
                        <div class="sub-container">
                            <div class="section-container flex-col-single">
                                <AllMapEchart   ref="hbMapEchart"></AllMapEchart>
                            </div>
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col :xs="24" :xxl="6">
                <div class="sub-container">
                    <div class="section-container flex-col-double">
                        <div class="block-b">
                            <img src="../../assets/title8.png"/>
                            <!-- <div class="title">全国违规数据汇总</div> -->
                            <div class="content">
                                <a-list :grid="{ gutter: 16, xs: 2, lg:4, xxl:2}" :dataSource="alarm_summary">
                                    <a-list-item
                                            size="small"
                                            slot="renderItem"
                                            slot-scope="item"
                                            style="font-size:15px;color:#c6cce6;margin-bottom:-9px;"
                                    >
                                        {{item.label}}:
                                        <b style="font-size:14px;color:#fff">
                                            
                                            <a v-if="item.flag" slot="title" href="#" @click="clickToPage(item.path,item.params)" style="color: #FF0000;text-decoration:underline;">
                                                {{item.value}} </a>
                                            <a v-else slot="title" href="#" @click="clickToPage(item.path,item.params)" style="color: #C88D37;text-decoration:underline;">
                                                {{item.value}} </a>
                                                </b>&nbsp;个
                                    </a-list-item>
                                </a-list>
                            </div>
                        </div>

                        <div class="block-d">
                            <!-- <div class="title"> -->
                            <div > 
                                 
                                <!-- <div>全国违规数据趋势变化图</div> -->
                                <div class="ui-btns">
                                    <img src="../../assets/title9.png"/>
                                    <a
                                            href="javascript:void(0)"
                                            :class="alarmLive?'current':'currentWait'"
                                            @click="switchAlarmLive"
                                    >直播</a>
                                    <a
                                            href="javascript:void(0)"
                                            :class="alarmVod?'current':'currentWait'"
                                            @click="switchAlarmVod"
                                    >点播</a>
                                </div>
                            </div>
                            <div class="content"  style="height:96%;">
                                 <LineEchart  ref="alarmEchart"></LineEchart>

                            </div>
                        </div>
                    </div>
                </div>
            </a-col>
        </a-row>

        <a-row type="flex" :gutter="16" style="margin-top:16px;">
            <a-col :xs="12" :xxl="6">
                <div class="sub-container">
                    <div class="section-container flex-col-double">
                        <div class="block-f">
                             <!-- <div class="title">全国新增直播节目统计</div>  -->
                            <img src="../../assets/title7.png"/> 
                            <div class="content">
                                <Tabs :tabs="tabs1" @switchTab="addLiveSwitchTab"  ref="tabLiveAdd" ></Tabs>
                            </div>
                            <!-- 柱形图 -->
                            <BarEchart ref="addliveBarEchart"></BarEchart>
                        </div>

                        <div class="block-g">
                            <!-- <div class="title">全国点播节目</div> -->
                            <img src="../../assets/title13.png"/>
                            <div class="content"  style="height: 200px;"  >
                                <Tabs :tabs="tabs2"  @switchTab="addVodSwitchTab"  ref="tabVodCount"></Tabs>
                                <div class="scroll-container">
                                    <div class="flex-a">
                                        <div v-for="(item, index) in newVodData"
                                             :key="index" :title="item.title">{{item.name}}</div>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col :xs="12" :xxl="4">
                <div class="sub-container">
                    <div class="section-container flex-col-double">
                        <div class="block-h">
                            <!-- <div class="title">全国直播频道</div> -->
                              <img src="../../assets/title12.png"/>
                            <div class="content">
                                <TabTitle   @tabchange="tabchange" :frontId="frontId" :platformType="platformType" ></TabTitle>
                                <TabContent :channels = 'curChannels' @pagechange="channelPageChange" @channelSelect="channelSelect" :curpage = 'curChannelPage' :total = 'curChannelTotal' :totalpage = 'curChannelPageTotal'></TabContent>
                            </div>
                        </div>

                        <div class="block-i">
                            <!-- <div class="title">全国直播节目统计</div> -->
                            <img src="../../assets/title14.png"/>

                            <div class="content"  style="height: 200px;"   >
                                <!-- <div class="flex-container" style=" width: 100%; height: 160px;"   id="newLiveEchart">
                                </div> -->
                                 <div class="scroll-container">
                                    <div class="flex-a">
                                        <div v-for="(item, index) in newLiveEchartData"
                                             :key="index" :title="item.title">{{item.name}}</div>
                                    </div>
                                
                                </div>
                                <!-- <div class="flex-container" style=" width: 100%; height: 160px;"   id="newLiveEchart2">
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col class="middle-section" :xs="16" :xxl="8">
                <div class="sub-container" style="padding-top:68%;  margin-top: 40px;">
                    <div class="section-container flex-col-single">
                        <player :program="curMedia" height="90%" :flagPlay="false" :loading="mediaLoading" ref="mediaPlayer"></player>
                    </div>
                </div>
            </a-col>
            <a-col class="middle-section" :xs="8" :xxl="6">
                <div class="sub-container">
                    <div class="section-container flex-col-double">
                        <div class="block-j">
                            <!-- <div class="title">全国新增直播违规数据分布图</div> -->
                              <img src="../../assets/title10.png"/>
                              <div class="content">
                                <Tabs :tabs="tabs4" @switchTab="addLiveSwitchTab_wg"  ref="tabLiveWgAdd" ></Tabs>
                            </div>
                            <!-- 柱形图 -->
                            <div class="content" style="height: 200px;" >
                                <!-- 柱形图 -->
                                <BarEchart ref="addLiveAlarmEchart"></BarEchart>
                            </div>
                        </div>

                        <div class="block-k">
                            <!-- <div class="title">全国点播违规节目统计</div> -->
                            <img src="../../assets/title11.png"/>
                            <!-- 饼图趋势图 -->
                            <div class="content" style="height: 200px;"  >
                                <PieEchart ref="addVodAlarmEchart"></PieEchart>
                            </div>
                        </div>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
    import LineEchart from "./components/LineEchart";
    import AllMapEchart from "./components/AllMapEchart";
    import BarEchart from "./components/BarEchart";
    import PieEchart from "./components/PieEchart";
    import Tabs from "./components/Tabs";
    import TabContent from "./components/TabContent";
    import TabTitle from "./components/TabTitle";
    import player from "../../components/backPlay";
    import moment from 'moment';
    export default {
        name: "home",
        components: {
            LineEchart,
            AllMapEchart,
            BarEchart,
            PieEchart,
            Tabs,
            TabContent,
            player,
            TabTitle,
        },
        data() {
            return {
                curMedia: {
                    mediaId:'',
                    playType:"直播",
                    id: "990",
                    orgName:"",
                    channelName: "",
                    frontName:'',
                    source: "",
                    showBtn:false,
                    recordFlag:false,
                    type: "live",
                    frontId: "601110010001",
                    episode: "1",
                    heartbeatId:'',
                },
                mediaLoading: false,
                curChannels:[],
                curChannelCategroy: '央视',
                curChannelPage: 1,
                curChannelPageTotal: 0,
                curChannelTotal: 0,   //频道总数
                tabs1: [
                    { name: "一级平台" },
                    { name: "二级播控" },
                    { name: "三级分发" },
                    { name: "六级终端" }
                ],
                tabs2: [
                    { name: "一级平台" },
                    { name: "二级播控" },
                    { name: "三级分发" },
                    { name: "六级终端" }
                ],
                tabs3: [{ name: "央视" },  { name: "卫视" }, { name: "本地" }, { name: "其他" }],
                tabs4: [
                    { name: "一级平台" },
                    { name: "二级播控" },
                    { name: "三级分发" },
                    { name: "六级终端" }
                ],
                live: true,
                vod:  false,
                alarmLive: true,
                alarmVod: false,
                todayTime:   moment().format('YYYY-MM-DD'),
                data_summary: [
                    {
                        label: "监测区域",
                        key: "province",
                        value: "0",
                        path:"/dataManager/moniterAreaManage",
                        params:{
                            name:""
                        }
                    },
                    {
                        label: "监测区域节点",
                        key: "station",
                        value: "0",
                        path:"/dataManager/moniterAreaManage",
                        params:{
                            name:"2"
                        }
                    },
                    {
                        label: "二级监测节点",
                        key: "node2",
                        value: "0",
                        path:"/systemManage/terminalInfoManage",
                         params:{
                              level: 2,
                              name: ''
                         }
                    },
                    {
                        label: "三级监测节点",
                        key: "node3",
                        value: "0",
                        path:"/systemManage/terminalInfoManage",
                        params:{
                              level: 3,
                              name: ''
                         }
                    },
                    {
                        label: "六级监测节点",
                        key: "node6",
                        value: "0",
                        path:"/systemManage/terminalInfoManage",
                         params:{
                              level: 6,
                              name: ''
                         }
                    },
                    {
                        label: "直播频道统计",
                        key: "live",
                        value: "0",
                        path:"/globalShow/programManage"
                    },
                    {
                        label: "直播节目统计",
                        key: "program",
                        value: "0",
                        path:"/programeDb/programList",
                        params:{name:"1"}
                    },
                    {
                        label: "点播节目统计",
                        key: "vod",
                        value: "0",
                        path:"/programeDb/programList",
                        params:{name:"2"}
                    },
                    {
                        label: "APP节目统计",
                        key: "app",
                        value: "0",
                        path:"/programeDb/appProgramList",
                        
                    }
                ],
                alarm_summary: [
                    {
                        label: "直播违规统计",
                        key: "liveTotal",
                        value: "0",
                        path:"/globalShow/k",
                        flag:true
                    },
                    {
                        label: "点播违规统计",
                        key: "vodTotal",
                        value: "0",
                        path:"/globalShow/vodAlreadyIllegal",
                        flag:true
                    },
                    {
                        label: "APP违规统计",
                        key: "appTotal",
                        value: "0",
                        path:"/differManage/TerminalAleadyIllegal",
                        flag:true,
                        params: {
                             categoryKey : 'app_compare'
                        },
                    },
                    {
                        label: "二级违规节点",
                        key: "node2",
                        value: "0",
                        path:"/systemManage/terminalInfoManage",
                        params: { 
                             level: 2,
                             name:''
                        },
                        flag:true
                    },
                    {
                        label: "三级违规节点",
                        key: "node3",
                        value: "0",
                        path:"/systemManage/terminalInfoManage",
                        params: { 
                             level: 3,
                             name: ''
                        },
                        flag:true
                    },
                    {
                        label: "六级违规节点",
                        key: "node6",
                        value: "0",
                        path:"/systemManage/terminalInfoManage",
                        params: { 
                              level: 6,
                              name: ''
                        },
                        flag:true
                    },
                    {
                        label: "今日疑似违规直播",
                        key: "liveNotConfirm",
                        value: "0",
                        path:"/globalShow/j",
                        params: { 
                             name: moment().format('YYYY-MM-DD')
                        }
                    },
                    {
                        label: "今日疑似违规点播",
                        key: "vodNotConfirm",
                        value: "0",
                        path:"/globalShow/n",
                        params: { 
                             name: moment().format('YYYY-MM-DD')
                        }
                    },
                     {
                        label: "今日疑似违规APP",
                        key: "appNotConfirm",
                        value: "0",
                        path:"/differManage/TerminalIllegal",
                        params: { 
                             name: moment().format('YYYY-MM-DD'),
                             categoryKey : 'app_compare'
                        }
                    },
                    {
                        label: "今日违规直播",
                        key: "liveConfirm",
                        value: "0",
                        flag:true,
                        path:"/globalShow/k",
                        params: { 
                             name: moment().format('YYYY-MM-DD')
                        }

                    },
                    {
                        label: "今日违规点播",
                        key: "vodConfirm",
                        value: "0",
                        flag:true,
                        path:"/globalShow/vodAlreadyIllegal",
                        params: { 
                             name: moment().format('YYYY-MM-DD')
                            }
                    },
                    {
                        label: "今日违规APP",
                        key: "appConfirm",
                        value: "0",
                        flag:true,
                        path:"/differManage/TerminalAleadyIllegal",
                        params: { 
                             name: moment().format('YYYY-MM-DD'),
                             categoryKey : 'app_compare'
                         }
                    }
                ],
                location:[],
                headStyle: {
                    fontSize: "24px",
                    color: "#fff"
                },
                //目前是默认值后期动态
                areaCode: "000000",
                frontId:"601110010001",
                frontName:'北京用户终端联通001',
                platformType:6,

                echartData: null, //数据趋势变化 直播点播折线图数据数组
                alarmEchart:null,//违规数据趋势变化 直播点播折线图对象
                alarmEchartData:[], //数据趋势变化 直播点播折线图数据数组
                addLiveEchartData:[], //新增直播节目统计柱状图数组
                addLiveAlarmEchartData:[], //新增直播违规节目统计柱状图数组
                addVodAlarmEchartData:[], //最新点播违规节目统计 饼图数据
                newVodData:[], //最新点播节目数据
                newLiveEchart:null,
                newLiveEchartData:[],
                geoData:[],
                geoCoordMap:null,
                curpage:0,
            };
        },
        methods: {
            //汇总数据跳转 使用路由跳转
            clickToPage(page,params){
                  if(params  && (params.name != undefined|| params.categoryKey  != undefined )){
                     let id =  params.name;
                     if(params.level || params.categoryKey){
                          id = params;
                     }
                     this.$router.push({
                        path: page,
                        query: {
                             id:id
                        }
                    })
                }else{
                    this.$router.push({
                        path: page
                    })
                }
            },
            //首页整体数据加载
            async getData() {
            
                //1.地图初始化
                this.loadMapEchart();

                //获取首页数据汇总和违规数据汇总
                let statistics_res = await this.Request.get(this, "/javaApi/pagestatistics.do?method=ZjQgDataSum",  {
                    params: {
                        areaCode:this.areaCode,
                        frontId: this.frontId
                    }
                });
                //2.数据汇总
                this.data_summary.map(item => {
                    if(statistics_res.dataSummary!= null && statistics_res.dataSummary[item.key]!=null && statistics_res.dataSummary[item.key]!=0){
                        item.value = statistics_res.dataSummary[item.key];
                    }

                });
                //3.违规数据汇总
                this.alarm_summary.map(item => {
                    if(statistics_res.alarmSummary !=null && statistics_res.alarmSummary[item.key] !=null ){
                        if(item.key==='node2'){
                            item.params.name = statistics_res.alarmSummary['node2_orgId']
                        }
                        if(item.key==='node3'){
                            item.params.name = statistics_res.alarmSummary['node3_orgId']
                        }
                        if(item.key==='node6'){
                            item.params.name = statistics_res.alarmSummary['node6_orgId']
                        }
                        item.value = statistics_res.alarmSummary[item.key];
                    }
                });
                //4. 数据趋势变化图（直播）
                this.switchLive();
                //5. 直播违规数据趋势变化图
                this.switchAlarmLive();

                //6.新增直播节目统计柱状图
                this.addLiveSwitchTab("六级终端",3);

                //7直播频道
                this.getChannels();

                //8.新增直播违规节目数据分布柱状图
                this.addLiveSwitchTab_wg("六级终端",3);

                //9.新增点播节目统计
                this.addVodSwitchTab("六级终端",3);

                //10.直播节目统计
                this.newLiveEchartLoad();

                //11.最新点播违规饼图
                this.addVodAlarmEchartLoad();

            },
            //加载地图
            async loadMapEchart(){
                //地图数据获取
                let params = {};
                let res = await this.Request.get(this, "/javaApi/pagestatistics.do?method=ZjMapDtData",  {
                    params: params
                });
                this.geoCoordMap = {}
                this.geoData = [];
                res.forEach((item,index)=>{
                     let lgn = [];
                     lgn.push(item.longItude);
                     lgn.push(item.latItude);
                     this.geoCoordMap[item.departmentName] = lgn;
                     this.geoData.push({
                            "name":item.departmentName
                            ,"value":100
                            ,"id":item.manageArea
                            ,"lgn":item.longItude
                            ,"lat":item.latItude
                        });
                })
                this.$refs['hbMapEchart'].init(this.geoCoordMap,this.geoData);
            },
            //点击直播频道播放视频
            async mediaPlay(mediaId) {
                this.mediaLoading = true;
                let channelName  = "";
                this.curChannels.forEach((item,index)=>{
                    if(item.channelId == mediaId){
                        channelName = item.name;
                        return ;
                    }
                })
                let params = {
                    type: 'live',
                    frontId: this.frontId, 
                    frontName: this.frontName,
                    id: mediaId,
                    orgId: this.frontId
                };
                Object.assign(this.curMedia, params);
                //暂时使用六级前端直播流播放
                let url ="/javaApi/monitorLive.do?method=broadCast"
                let formData = new FormData();
                formData.append('channelId',mediaId);
                formData.append('orgId',this.frontId);
                let resPlay = await this.Request.post(this, url, formData);
                
                if(resPlay && resPlay.url && resPlay.url!=''){
                    this.curMedia.channelName = channelName;
                    this.curMedia.source = resPlay.url;
                    //心跳
                    this.curMedia.heartbeatId = resPlay.heartbeatId;
                    this.mediaLoading = false;
                    this.$refs['mediaPlayer'].initial();
                }
                
            },
            //直播数据趋势变化图
            async switchLive(){
                this.live = true;
                this.vod =  false;

                let params =  {
                    areaCode:this.areaCode,
                    frontId: this.frontId,
                    playType:'live'
                }
                this.loadLineEchart(params);
            },
            //点播数据趋势变化图
            async switchVod(){
                this.live = false;
                this.vod =  true;
                let params =  {
                    areaCode:this.areaCode,
                    frontId: this.frontId,
                    playType:'vod'
                }
                this.loadLineEchart(params);
            },
            //数据趋势折线图加载
            async loadLineEchart(params){
                this.echartData={};
                let res = await this.Request.get(this, "/javaApi/pagestatistics.do?method=DataSumQs",  {
                    params: params
                });
                let  rows = res.rows;
                //声明变量
                let xAxisData = [];
                let seriesData_array = ['seriesData_one','seriesData_two','seriesData_three','seriesData_six'];
                let lineEchart = {};
                //遍历数据
                rows.forEach((item,index)=>{
                    let data = [];
                    //遍历具体不通平台对应的不通数据
                    let channels = item.channels;
                    channels.forEach((channel)=>{
                        //只存一次时间
                        if(index==0){
                            xAxisData.push(channel.date);
                        }
                        data.push(channel.count)
                    })
                    lineEchart[seriesData_array[index]] = data;
                    lineEchart["xAxisData"]= xAxisData;
                });
                this.echartData = lineEchart;
                this.$refs['tabLineEchart'].init(this.echartData);
            },
            //直播违规数据趋势变化图
            async switchAlarmLive(){
                this.alarmLive = true;
                this.alarmVod = false;
                let params =  {
                    areaCode:this.areaCode,
                    frontId: this.frontId,
                    playType:'live'
                }
                this.loadLineAlarmEchart(params);

            },
            //点播违规数据趋势变化图
            async switchAlarmVod(){
                this.alarmLive = false;
                this.alarmVod = true;

                let params =  {
                    areaCode:this.areaCode,
                    frontId: this.frontId,
                    playType:'vod'
                }
                this.loadLineAlarmEchart(params);
            },
            //加载违规数据折线图
            async loadLineAlarmEchart(params){
                this.alarmEchart = null;
                this.alarmEchartData={};
                let res = await this.Request.get(this, "/javaApi/pagestatistics.do?method=DataSumQsWg",  {
                    params: params
                });
                let  rows = res.rows;
                //声明变量
                let xAxisData = [];
                let seriesData_array = ['seriesData_one','seriesData_two','seriesData_three','seriesData_six'];
                let lineEchart = {};
                //遍历数据
                rows.forEach((item,index)=>{
                    let data = [];
                    //遍历具体不通平台对应的不通数据
                    let channels = item.channels;
                    channels.forEach((channel)=>{
                        //只存一次时间
                        if(index==0){
                            xAxisData.push(channel.date);
                        }
                        data.push(channel.count)
                    })
                    lineEchart[seriesData_array[index]] = data;
                    lineEchart["xAxisData"]= xAxisData;
                });
                 this.$refs['alarmEchart'].init(lineEchart);
            },

            async switchTab(item, index) {
                this.curChannelCategroy = item.name;
                await this.getChannels();
            },
            //直播频道
            async getChannels(){
                const category = this.curChannelCategroy;
                let params = {
                    areaCode:this.areaCode,
                    frontId: this.frontId,
                    categoryName:category,
                    page: this.curChannelPage,
                    pageSize: 6,
                }
                let resChannels  =  await this.Request.get(this,'/javaApi/pagestatistics.do?method=DataSumZxZbTj', {
                  params:params
                });
                const channelTotal = resChannels.total;
                this.curChannelPageTotal = Math.ceil(channelTotal / params.pageSize);
              
                resChannels.list.forEach((item)=>{
                    item.name = item.channelName;  
                });
                this.curChannels = resChannels.list;
                this.curChannelTotal = channelTotal;
            },
            //直播频道分页
            async channelPageChange(page){
                this.curChannelPage = page;
                await this.getChannels();
            },
            //直播频道选择播放
            async channelSelect(channelId){
                await this.mediaPlay(channelId);
            },
            //分页
            tabchange(curChannelCategroy,index){
                this.curChannelCategroy = curChannelCategroy;
                this.curChannelPage = 1;
                this.getChannels();
            },
            //新增直播节目统计柱状图
            async addLiveSwitchTab(item, index){
                let platformTypeArray = [1,2,3,6];
                let data_res = await this.Request.get(this, "/javaApi/pagestatistics.do?method=DataSumXzzbjmTj",  {
                    params: {
                        areaCode:this.areaCode,
                        frontId:this.frontId,
                        platformType:platformTypeArray[index]
                    }
                });
                let  rows = data_res.rows;

                let  barEchart = {};
                let  xAxisData = [];
                let  seriesData = [];

                rows.forEach((item)=>{
                    let programes = item.programes;
                    programes.forEach((programe)=>{
                        xAxisData.push(programe.date);
                        seriesData.push(programe.count)
                    })
                });
                barEchart["seriesData"] = seriesData;
                barEchart["xAxisData"] = xAxisData;
                barEchart["seriesName"]= "新增数";
                this.addLiveEchartData= barEchart;
                this.$refs['addliveBarEchart'].init(this.addLiveEchartData);
            },
             //新增直播违规数据分布图 tab切换
            async addLiveSwitchTab_wg(item, index){
                let platformTypeArray = [1,2,3,6];
          
                let data_res = await this.Request.get(this, "/javaApi/pagestatistics.do?method=DataSumXzzbjmWgTj",  {
                    params: {
                        areaCode:this.areaCode,
                        frontId: this.frontId,
                        platformType:platformTypeArray[index]
                    }
                });
   
                let  rows = data_res.rows;

                let  barEchart = {};
                let  xAxisData = [];
                let  seriesData = [];

                rows.forEach((item)=>{
                    let programes = item.programes;
                    programes.forEach((programe)=>{
                        xAxisData.push(programe.date);
                        seriesData.push(programe.count)
                    })
                });
                barEchart["seriesData"] = seriesData;
                barEchart["xAxisData"] = xAxisData;
                barEchart["seriesName"]= "违规数";
                this.addLiveAlarmEchartData= barEchart;

                this.$refs['addLiveAlarmEchart'].init(this.addLiveAlarmEchartData);
            },

            //最新点播违规饼图
            async addVodAlarmEchartLoad(){ 

                 let data_res = await this.Request.get(this, "/javaApi/pagestatistics.do?method=DataSumDbWgJmTj",  {
                    params: {
                        areaCode:this.areaCode,
                        frontId: this.frontId,
                        platformType:6
                    }
                });
                let legendData = [];
                let seriesData = [];

                data_res.forEach((item)=>{
                    legendData.push(item.name);
                    let serice = {name:item.name,value:item.num};
                    seriesData.push(serice)
                });

                let vodAlarmEchart = {
                    "legendData":legendData,
                    "seriesData":seriesData
                }
                this.$refs['addVodAlarmEchart'].init(vodAlarmEchart);
            },
            //新增点播节目统计 数据请求
            async addVodSwitchTab(item, index){
                this.newVodData =[];
                let platformType = [1,2,3,6];
                let data_res = await this.Request.get(this, "/javaApi/pagestatistics.do?method=DataSumZxDbTj",  {
                    params: { 
                        areaCode:this.areaCode,
                        frontId: this.frontId,
                        platformType:platformType[index]
                    }
                });

                data_res.forEach((item)=>{
                    let  vodObeject = {};
                    if(item.name.indexOf("用户终端")){
                        vodObeject.name  =  item.name.replace("用户终端",'')+"("+item.num+")"
                    }
                    vodObeject.title  =  item.name+"("+item.num+")"

                    this.newVodData.push(vodObeject);
                    
                })


            },
            //直播节目统计 数据请求
            async newLiveEchartLoad(){ 
                let data_res = await this.Request.get(this, "/javaApi/pagestatistics.do?method=DataSumZbJmTj",  {
                    params: { 
                        areaCode:this.areaCode,
                        frontId: this.frontId,
                        platformType:6
                    }
                });
                this.newLiveEchartData =[];
               
                data_res.forEach((item)=>{
                      let  vodObeject = {};
                      if(item.name.indexOf("频道")){
                         vodObeject.name =  item.name.replace("频道",'')+"("+item.num+")";
                       }
                        vodObeject.title =  item.name+"("+item.num+")";
                    
                    this.newLiveEchartData.push(vodObeject);
                })
            },
             //最新直播节目统计 环形图(弃用)
            async newLiveEchartAjax(echartObj,echartData){

                let  data = echartData.data;
                let  titleArr= [], seriesArr=[];
                let  colors=echartData.colors;

                data.forEach(function(item, index){
                    titleArr.push(
                        {
                            text:item.name,
                            left: index * 20 + 20 +'%',
                            top: '65%',
                            textAlign: 'center',
                            textStyle: {
                                fontWeight: 'normal',
                                fontSize: '10',
                                color: colors[index][0],
                                textAlign: 'center',
                            },
                        }
                    );
                    seriesArr.push(
                        {
                            name: item.name,
                            type: 'pie',
                            clockWise: false,
                            radius: [25, 16],
                            itemStyle:  {
                                normal: {
                                    color: colors[index][0],
                                    shadowColor: colors[index][0],
                                    shadowBlur: 0,
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    },
                                }
                            },
                            hoverAnimation: false,
                            center: [index * 20+ 20 +'%', '40%'],
                            data: [{
                                value: item.value,
                                label: {
                                    normal: {
                                        formatter: function(params){
                                            return params.value;
                                        },
                                        position: 'center',
                                        show: true,
                                        textStyle: {
                                            fontSize: '10',
                                            fontWeight: 'normal',
                                            color: '#fff'
                                        }
                                    }
                                },
                            }, {
                                value: (Math.random()*100+item.value)-item.value,
                                name: 'invisible',
                                itemStyle: {
                                    normal: {
                                        color: colors[index][1]
                                    },
                                    emphasis: {
                                        color: colors[index][1]
                                    }
                                }
                            }]
                        }
                    )
                });
                let option = {
                    // backgroundColor: "#fff",
                    title: titleArr,
                    series: seriesArr
                };
                echartObj.setOption(option);
            }
        },
        mounted(){
            //加载数据
            this.getData();
            //全国新增直播
            this.$refs['tabLiveAdd'].currentIndex = 3;
            //全国点播节目统计
            this.$refs['tabVodCount'].currentIndex = 3;
            //全国新增直播违规数据分布图
            this.$refs['tabLiveWgAdd'].currentIndex = 3;
        }
    };
</script>

<style lang="less" scoped>
    @main-color: #e72b06;
    @media screen and (max-width: 1600px) {
        .middle-section {
            margin: 16px 0;
        }
    }
</style>
<style lang="less">
    @import '../../customStyle/homeAll';
</style>