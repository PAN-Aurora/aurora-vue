<template>
  <div class="outSide" ref="outer">
    <!-- 视频标题 开始 -->
    <h2 v-if="showTitle">
      <span class="proTitle">
        <a-tag v-if="program.type === 'live'" color="#2db7f5">直播</a-tag>
        <a-tag v-else-if="program.type === 'vod'" color="#87d068">点播</a-tag>
        <a-tag v-else-if="program.type === 'review'" color="#108ee9">录像</a-tag>
        <a-tag v-else-if="program.type === 'monitor'" color="#108ee9">监看</a-tag>
             {{program.orgName}} {{program.channelName}}
      </span>
    </h2>
      <!-- 视频标题 结束 -->

    <!-- 播放器布局 开始 -->
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
      v-if="program.type != 'live'"
    ></video>

    <!-- 播放器布局 结束 -->
    <a-spin v-if="loading" size="large" tip="加载中" :style='{position:"absolute", top: height / 2}' />
    
    <!--视频关闭 开始-->
    <div
      class="videoModal"
      v-if="showCover"
      @mouseleave="mouseLeave"
      @click="videoOperate()"
     >
       <a-icon type="close-circle" class="playIcon" />
    </div>
    <!--视频关闭 结束-->
  </div>
</template>
<script>
import {POST } from "../utils/restful_util";
export default {
  name: "hlsPlayer",
  props: {
    program: {
       type: Object,
        default: function (){
          return {
            type: '', //播放类型 直播 点播 监看
            id: '',  //直播频道id 点播节目id
            source: '', //播放地址
            orgId: '',  //终端id
            orgName:'', //终端名称
            heartbeatId: '', //心跳
            episode: '', //集数
            channelName:'' //频道名称/节目名称
          }
        }
    },
    height: {
      type: String
    },
    loading: {
      type: Boolean
    },
    flagPlay:{
      type: Boolean,
      default: false,
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
      channelId: ''
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
    //初始化
    initial() {
        //初始化播放器并加载地址播放 //hls.js
        let video = this.$refs["video"];
        this.hls.attachMedia(video);
        this.hls.on(this.$hls.Events.MANIFEST_PARSED, (event, data) => {
        video.play();
        // this.playTimer(video);
        this.flagPlay = true;
        //发送心跳
        this.sendHeartBeat();
        console.log("manifest loaded, found " + data.levels.length + " quality level");
      });
      if (this.program.type === "device") {
           this.currentTimeInterval = setInterval(() => {
          this.currentTime = new Date(); // 修改数据date
        }, 1000);
      }
      //直播流
      if (this.program.type === 'live') {
          this.channelId = _.cloneDeep(this.program.id)
       }
    },
    //播放时间
    playTimer(video) {
      this.showCover = true;
      this.timer = setInterval(() => {
         if (video.paused) {
            this.clearTimer();
         }
      }, 1000);
    },
    //清除定时器
    clearTimer() {
      clearInterval(this.timer);
      clearInterval(this.heartTimer);
      if (this.program.type === "device") {
        clearInterval(this.currentTimeInterval);
      }
    },
    //鼠标按下 
    mouseEnter() {
      if(this.flagPlay){
         this.showCover = true;
      }
    },
    //鼠标离开
    mouseLeave() {
      if(this.flagPlay){
        this.showCover = false;
      }
    },
    //发送心跳
    sendHeartBeat() {
      //存在心跳id就发送心跳
      if(this.program.heartbeatId && this.program.heartbeatId!=''){
            let formData = new FormData();
            formData.append('heartbeatId', this.program.heartbeatId);
            formData.append('orgId', this.program.orgId);
            let url = '';
            if(this.program.type == 'live'){ //直播
              url = '/iptv_ln/monitorLive.do?method=heartBeat';
            }else if(this.program.type == 'vod'){ //点播
              url = '/iptv_ln/monitorVod.do?method=heartBeat';
            }else if(this.program.type == 'monitor'){ //监看
              url = '/javaApi/harmfulAlarmConfig.do?method=stbHeartbeat';
            }
            POST(this, url, formData, function() {});
            this.heartTimer = setInterval(() => {
              POST(this, url, formData, function() {});
            }, 30000);
      }
    },
    iconFormat() {
      let video = this.$refs["video"];
      let flag = video.paused ? true : false;
      return flag;
    },
    //视频关闭事件
    videoOperate() {
      if(this.flagPlay){
        this.hls.stopLoad();
        this.hls.detachMedia();
        this.clearTimer();
        this.flagPlay = false;
        this.showCover = false;
      }
    }

  },
  mounted() {
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
  destroyed() {
    if(this.flagPlay){
        this.hls.stopLoad();
        this.hls.detachMedia();
        this.clearTimer();
        this.flagPlay = false;
        this.showCover = false;
    }
     this.hls = null;
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
  //background-color: @black;
  background-color: rgb(41, 48, 90);
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