<template>
  <div class="outSide" ref="outer">
    <h2 v-if="showTitle">
      <span class="proTitle">
        <a-tag v-if="program.type === 'live'" color="#2db7f5">直播</a-tag>
        <a-tag v-else-if="program.type === 'vod'" color="#87d068">点播</a-tag>
        <a-tag v-else-if="program.type === 'review'" color="#108ee9">录像</a-tag>
        <a-tag v-else-if="program.type === 'monitor'" color="#108ee9">监看</a-tag>
        {{program.name}}-{{program.frontName}}
        <span
          v-if="program.type === 'device' && currentTime"
        >{{currentTime | formatDate}}</span>
      </span>

      <div class="btnList" v-if="!(showBtn === false)">
        <a-icon
          type="video-camera"
          class="rightIcon"
          v-if="!recordFlag && program.source"
          @click.stop="toggleRecord('record')"
        />
        <span v-if="recordFlag && program.source" style="font-size:14px;">录制中...</span>
        <a-icon
          type="pause-circle"
          class="rightIcon"
          v-if="recordFlag && program.source"
          @click.stop="toggleRecord('stop')"
        />
        <a-popover
          trigger="click"
          v-model="vodEpisodeVisible"
          placement="leftBottom"
          v-if="program.source"
        >
        <div slot="title" style="color: rgb(88,105,217)">{{program.name}}</div>
          <div slot="content" style="width:220px; color: black" v-if="program.type === 'vod'"> <!--点播节目详细信息-->
            <p>节目名称：{{vodDetail.vodName}}</p>
            <p>第{{vodDetail.episode}}集/共{{vodDetail.count}}集</p>
            <p>导演：{{vodDetail.director}}</p>
            <p>主演：{{vodDetail.cast}}</p>
            <p>{{vodDetail.pathCategory}}</p>
            <p>节目类型：{{vodDetail.istv|istvFilter}}</p>
            <p>节目描述：{{vodDetail.description}}</p>
            <p>节目时长：{{vodDetail.vodlen}}</p>
            <p>创建时间：{{vodDetail.insertTime}}</p>
            <p>上架时间：{{vodDetail.onShelfTime}}</p>
            <a-button type="default" @click="vodEpisodeVisible = false">关闭</a-button>
          </div>
          
          <div slot="content" style="width:220px;" v-if="program.type === 'review'"> <!--回看内容详细信息-->
            <ul class="ulPro">
               <a-spin tip="Loading..." :spinning="listLoading" style="width: 100%">
              </a-spin>
              <li v-for="program in programList" :key="program.programId">
                <div>
                  <a @click="selectReview(program)">{{program.name}}({{program.startTime}}-{{program.endTime}})</a>
                </div>
              </li>
            </ul>
            <a-button type="default" @click="vodEpisodeVisible = false">关闭</a-button>
          </div>
          <div slot="content" style="width:220px; color: black" v-if="program.type === 'live'"> <!--直播频道详细信息-->
            <p>终端名：{{liveDetail.orgName}}</p>
            <p>是否有回看：{{liveDetail.noReview|reviewFilter}}</p>
            <p>创建时间：{{liveDetail.insertTime}}</p>
            <p>上架时间：{{liveDetail.onShelfTime}}</p>
            <p>是否付费：{{liveDetail.charge|chargeFilter}}</p>
            <a-button type="default" @click="vodEpisodeVisible = false">关闭</a-button>
          </div>
          <a-icon type="bars" class="rightIcon" @click.stop="getProgramList()" />
        </a-popover>
        <!-- <a-icon type="camera" class="rightIcon" /> -->
      </div>
    </h2>
    <video
     poster="../assets/video_background.png"
      @mouseenter="mouseEnter()"
      ref="video"
      muted
      controls
      :style='{"width": "95%","object-fit": "fill", "height": height}'
      v-if="program.type === 'live'"
    ></video>

    <video
        poster="../assets/video_background.png"
      @mouseenter="mouseEnter()"
      ref="video"
      muted
      controls
      :style='{"width": "95%","object-fit": "fill", "height": height}'
      v-if="!(program.type === 'live')"
    ></video>
    <a-spin v-if="loading" size="large" tip="加载中" :style='{position:"absolute", top: height / 2}' />
    <div
      class="videoModal"
      v-if="showCover"
      @mouseleave="mouseLeave"
      @click="videoOperate()"
    >
       <a-icon type="close-circle" class="playIcon" />
    </div>
    <a-modal
      title="填写样本信息"
      :visible="modalFlag"
      :maskClosable="false"
      @ok="ok"
      okText="确认"
      @cancel="cancel"
      cancelText="取消"
      class="darkModal"
    >
      <label>录制名称：</label>
      <a-input style="width: 70%" v-model="recordName"/>
    </a-modal>
  </div>
</template>
<script>
import { GET, POST } from "../utils/restful_util";
import { notificationInfo } from "../utils/alert_util";
import moment from 'moment'
export default {
  name: "hlsPlayer",
  props: {
    program:{
      type: Object,
      default: function (){
        return {
          type: '',
          id: '',
          source: '',
          name: '',
          frontId: '',
          frontName: '',
          episode: ''
        }
      }
    },
    height: {
      type: String
    },
    loading: {
      type: Boolean
    },
    showBtn: {
      type: Boolean,
      default: true,
    },
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      vodEpisodeVisible: false,
      modalFlag: false,
      currentTime: null,
      currentTimeInterval: null,
      programDetail: {},
      programList: [],
      timer: null,
      recordTimer: null,
      heartTimer: null,
      showCover: false,
      hls: null,
      recordFlag: false,
      recordId: "",
      listLoading: false,
      channelId: '',
      flagPlay: false,
      liveDetail: {}, // 直播频道详情信息实体
      vodDetail: {}, // 点播节目详情信息实体
      recordName: '',
      recordHeartbeatId: '' // 录制任务心跳
    };
  },
  filters: {
    formatDate: function(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    }
  },
  methods: {
    ok() { // 开始录制
      this.recordFlag = true;
      notificationInfo(this, "录像进行中，停止将完成取样。");
      let formData = new FormData();
      formData.append("id", this.program.id); // 节目id
      formData.append("name", this.recordName); // 录制任务名称
      formData.append("orgId", this.program.orgId);
      formData.append("type", this.program.type);
      formData.append("episode", this.program.episode);
      formData.append("userId", sessionStorage.getItem("userId"));
      this.startReocrd(formData); // 调用录制任务启动接口
      this.modalFlag = false;
    },
    cancel() {
      this.modalFlag = false;
    },

    initial() {
      this.hls = null;
      this.initHls();

      let video = this.$refs["video"];
      this.hls.attachMedia(video);
    
      this.hls.on(this.$hls.Events.MANIFEST_PARSED, (event, data) => {
        video.play();
        // this.playTimer(video);
         
        this.flagPlay = true;
        this.sendHeartBeat();
        console.log(
          "manifest loaded, found " + data.levels.length + " quality level"
        );
      });
      if (this.program.type === "device") {
        this.currentTimeInterval = setInterval(() => {
          this.currentTime = new Date(); // 修改数据date
        }, 1000);
      }
      if (this.program.type === 'live') {
           this.channelId = _.cloneDeep(this.program.id)
       }
      this.getRecordStatus();
    },
    toggleRecord(type) { // 视频录制函数
      if (type === "record") { // 开始录制
        this.modalFlag = true; // 弹出录像名称填报界面
      } else { // 停止录制
        this.recordFlag = false;
        this.stopRecord();
      }
    },
    startReocrd(param) { // 调用开始录制接口
      let url = '/iptv_ln/monitorProgramme.do?method=start';
      POST(this, url, param, res => {
        this.recordHeartbeatId = res.data.heartbeatId;
      });
    },
    stopRecord() { // 调用停止录制接口
      let url = '/iptv_ln/monitorProgramme.do?method=stop';
      let formData = new FormData();
      formData.append("heartbeatId", this.recordHeartbeatId);
      formData.append("orgId", this.program.orgId);
      POST(this, url, formData,  res => {});
      //clearInterval(this.recordTimer);
    },
    getRecordStatus(){ // 查询当前节目有无录制任务
      let url = '/iptv_ln/monitorProgramme.do?method=findStatus';
      let trans = {
        id: this.program.id,
        orgId: this.program.orgId,
        type: this.program.type,
        episode: this.program.episode
      }
      GET(this, url, trans, res => {
        if(res.data){
          if(res.data.curStatus == 1){ // 录制中
            this.recordHeartbeatId = res.data.heartBeatId; // 获取录制任务的心跳id
            this.recordFlag = true;
          }else{
            this.recordFlag = false;
          }
        }else{
          this.recordFlag = false;
        }
      });
    },
    recordBeat(recordId) {
      POST(
        this,
        "/api/monitorRecord/heartbeat",
        { recordId: recordId },
        res => {}
      );
      recordTimer = setInterval(() => {
        POST(
          this,
          "/api/monitorRecord/heartbeat",
          { recordId: recordId },
          res => {}
        );
      }, 10000);
    },
    getProgramList() { // 查询直播频道、点播节目详情
      this.listLoading = true
      let url = '';
      if (this.program.type === 'vod') { // 点播
        url = '/iptv_ln/monitorVod.do?method=vodDetail';
        let trans = {
          vodCode: this.program.id,
          orgId: this.program.orgId,
          episode: this.program.episode
        };
        GET(this, url, trans, res => {
          this.listLoading = false;
          this.$set(this, 'vodDetail', res.data.vod);
          this.program.name = res.data.vod.vodName;
        });
      } else if (this.program.type === 'live' || this.program.type === 'review'){
        url = '/iptv_ln/monitorLive.do?method=liveDetail'; // 查询直播频道详情
        this.programList = []
        let trans = {
          orgId: this.program.orgId,
          channelId: this.program.id
        }
        GET(this, url, trans, (res) => {
          this.listLoading = false
          this.$set(this, 'liveDetail', res.data.vod)
        })
      }
    },
    selectEpisode(val) {
      let vod = {
        vodId: this.program.id,
        name: this.program.name,
        playType: 'vod',
        episode: val
      };
      this.vodEpisodeVisible = false;
      this.$emit("selectEpi", vod, this.program);
    },
    selectReview (program) {
      let review = {
        channelId: program.programId,
        name: program.name,
        playType: 'review'
      };
      this.program.type = 'review'
      this.vodEpisodeVisible = false;
      this.$emit("selectEpi", review, this.program);
    },
    playTimer(video) {
    
      this.showCover = true;
      this.timer = setInterval(() => {
        if (video.paused) {
          this.clearTimer();
        }
      }, 1000);
    },
    clearTimer() {
      clearInterval(this.timer);
      clearInterval(this.heartTimer);
      if (this.program.type === "device") {
        clearInterval(this.currentTimeInterval);
      }
    },
    mouseEnter() {
      if(this.flagPlay){
         this.showCover = true;
      }
    },
    mouseLeave() {
      if(this.flagPlay){
        this.showCover = false;
      }
    },
    // sendHeartBeat() {
    //   let trans = {
    //     id: this.program.id,
    //     type: this.program.type
    //   };
    //   GET(this, "/api/media/heartbeat", trans, function() {});
    //   this.heartTimer = setInterval(() => {
    //     GET(this, "/api/media/heartbeat", trans, function() {});
    //   }, 10000);
    // },
    sendHeartBeat() {
      let formData = new FormData();
      formData.append('heartbeatId', this.program.heartbeatId);
      formData.append('orgId', this.program.orgId);
      let url = '';
      if(this.program.type == 'live'){
        url = '/iptv_ln/monitorLive.do?method=heartBeat';
      }else if(this.program.type == 'vod'){
        url = '/iptv_ln/monitorVod.do?method=heartBeat';
      }else if(this.program.type == 'monitor'){
         url = '/javaApi/harmfulAlarmConfig.do?method=stbHeartbeat';
      }
      POST(this, url, formData, function() {});
      this.heartTimer = setInterval(() => {
        POST(this, url, formData, function() {});
      }, 30000);
    },
    iconFormat() {
      let video = this.$refs["video"];
      let flag = video.paused ? true : false;
      return flag;
    },
    videoOperate() {
      if(this.flagPlay){
        this.hls.stopLoad();
        this.hls.detachMedia();
        this.stopPlay();
        this.clearTimer();
        this.flagPlay = false;
        this.showCover = false;
      }
    },
    stopPlay(){ // 停止播放
      let formData = new FormData();
      formData.append('heartbeatId', this.program.heartbeatId);
      formData.append('orgId', this.program.orgId);
      let url = '';
      if(this.program.type == 'live'){
        url = '/iptv_ln/monitorLive.do?method=stop';
      }
      if(this.program.type == 'vod'){
        url = '/iptv_ln/monitorVod.do?method=stop';
      }
      POST(this, url, formData, function() {});
      this.programReset();
    },
    programReset(){
      let obj ={
        episode: "1",
        frontId: "",
        frontName: "",
        id: "",
        name: "",
        source: "",
        type: ""
      }
      Object.assign(this.program,obj);
      delete this.program.orgId;
      delete this.program.heartbeatId;
    },
    initHls(){
      this.recordHeartbeatId = '';
      if (this.$hls.isSupported()) {
      this.hls = new this.$hls();
      this.hls.on(this.$hls.Events.MEDIA_ATTACHED, () => {
        this.hls.loadSource(this.program.source);
        this.hls.on(this.$hls.Events.ERROR, (event, data) => {
          let errorType = data.type;
          let errorDetails = data.details;
          let errorFatal = data.fatal;
          console.log(errorType);
          console.log(errorDetails);
          console.log(errorFatal);
        });
      });
    }
    },
    beforeunloadFn(e) {
      // let url = '/api/loudness/getConfig';
      // POST(this,url,{a:"test"},res=>{});
    }
  },
  created() {
    window.addEventListener('unload', e => this.beforeunloadFn(e))
  },
  mounted() {
    this.initHls();
  },
  destroyed() {
    if(this.flagPlay){
      this.stopPlay();
      this.hls.stopLoad();
      this.hls.detachMedia();
      this.clearTimer();
      this.flagPlay = false;
      this.showCover = false;
    }
    this.hls = null;
    window.removeEventListener('beforeunload', e => this.beforeunloadFn(e));
  },
  filters: {
    reviewFilter: (text) => {
      switch(text){
        case '0':
          return '有回看';
        case '1':
          return '无回看';
      }
    },
    chargeFilter: (text) => {
      switch(text){
        case '0':
          return '免费';
        case '1':
          return '付费';
      }
    },
    istvFilter: (text) => {
      switch(text){
        case '0':
          return '电影';
        case '1':
          return '电视剧';
      }
    }
  }
};
</script>
<style lang="less" scoped>
@hundred: 100%;
@black: #000000;
@white: #fff;
@middle: 18px;

.outSide {
  height: @hundred;
  width: @hundred;
  background-color: @black;
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  border-radius: 15px;
}
.outSide h2 {
  text-align: left;
  color: @white;
  font-size: @middle;
  width: 100%;
  margin: 3;
  position: relative;
  padding: 0em 1.5em;
}
.outSide video {
  // margin: 0;
}
.rightIcon {
  font-size: 28px;
  margin-right: 0.5em;
}
.rightIcon:hover {
  cursor: pointer;
  color: @blue;
}
.btnList {
  position: absolute;
  top: 0;
  right: 0;
}
.videoModal {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  color: #fff;
  font-size: 40px;
}
.playIcon {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 9;
}
.videoModal:hover {
  cursor: pointer;
}
.right li {
  display: flex;
  white-space: nowrap;
}
.right li label:nth-child(1) {
  width: 30%;
}
.right li label:nth-child(2) {
  width: 70%;
  text-overflow: ellipsis;
  overflow-x: hidden;
}
</style>
<style lang="less">
@import "../customStyle/dartStyle.less";
video::-webkit-media-controls-overlay-enclosure {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(../assets/video_background.png);
    background-size: contain;
}

</style>