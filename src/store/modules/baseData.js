const baseData = {
    state: {
        frontLevel: [
            {label: '一级', value: 1},
            {label: '二级', value: 2},
            {label: '三级', value: 3},
            {label: '六级', value: 6}
        ],
        departmentCategoryMap:{
            '0': '监测监管机房',
            '1': '数据汇聚中心',
            '2': '直属监测台'
        },
        departmentCategory: [
            {label: '监测监管机房', value: 0},
            {label: '数据汇聚中心', value: 1},
            {label: '直属监测台', value: 2}
        ],
        provider: [
            {label: '移动', value: 1},
            {label: '联通', value: 2},
            {label: '电信', value: 3}
        ],
        taskTypeList: [
            {label: '直播', value: 'live', count: 4},
            {label: '点播', value: 'demand', count: 2},
            {label: '应用', value: 'apply', count: 1}
        ],
        channelTypeList: [
            {label: '央视频道', value: '央视频道'},
            {label: '地方频道', value: '地方频道'},
            {label: '卫视频道', value: '卫视频道'}
        ],
        recordType: [
            {label: '全天', value: 1},
            {label: '时段', value: 2}
        ],

        resolutionType: [
            {label: 'CIF', value: 'CIF'},
            {label: 'D1', value: 'D1'},
            {label: '720P', value: '720P'},
            {label: '1080P', value: '1080P'}
        ],
        videoEncodeType: [
            {label: 'H264', value: 'H264'}
        ],
        audioEncodeType: [
            {label: 'AAC', value: 'AAC'},
            {label: 'MP3', value: 'MP3'}
        ],
        videoBitrateType: [
            {label: '600K', value: '600K'},
            {label: '1M', value: '1M'},
            {label: '1.5M', value: '1.5M'},
            {label: '2M', value: '2M'},
            {label: '4M', value: '4M'}
        ],
        audioBitrateType: [
            {label: '64K', value: '64K'},
            {label: '128K', value: '128K'}
        ],
        provinceData: [],
        provinceMap: {},
        areaCodeTree: [],
        departmentMap: {},
        departmentTree: {},
        departmentData:[], //监测中心data
        frontTree: [],
        currentSelectedFront:{},
        isValidList:[{
                "label":"有效",
                "value":"1"
                 },{
                "label":"无效",
                "value":"0"
                 }
          ],
        isValidListMap:{
            '0': '无效',
            '1': '有效'
        },
        currentSelectedKeyWord:{ key: '-1', title:'全部' },
        currentSelectedKey:{ key: '', title:'全部',categoryKey:'root' },
        currentSelectedKeyVod:{ key: '', title:'全部',categoryKey:'root' },
        letterArray: [{"label":"A","value":"A"},{"label":"B","value":"B"},{"label":"C","value":"C"},
            {"label":"D","value":"D"},{"label":"E","value":"E"},
            {"label":"F","value":"F"},{"label":"G","value":"G"},{"label":"H","value":"H"},
            {"label":"I","value":"I"},{"label":"J","value":"J"},{"label":"K","value":"K"},
            {"label":"L","value":"L"},{"label":"M","value":"M"},{"label":"N","value":"N"},
            {"label":"O","value":"O"},{"label":"P","value":"P"},{"label":"Q","value":"Q"},
            {"label":"R","value":"R"},{"label":"S","value":"S"},{"label":"T","value":"T"},
            {"label":"U","value":"U"},{"label":"V","value":"V"},{"label":"W","value":"W"},
            {"label":"X","value":"X"},{"label":"Y","value":"Y"},{"label":"Z","value":"Z"}],
        qualityExceTypeList:[{name:"无伴音",value:"无伴音"},{name:"无信号",value:"无信号"},{name:"黑场",value:"黑场"},
            {name:"彩场",value:"彩场"},{name:"静帧",value:"静帧"},{name:"断流",value:"断流"}],
        branchCenterList:[],
        statusList:[{
            "label":"在用",
            "value":"1"
        },{
            "label":"不在用",
            "value":"0"
        }
        ],
        dialModeList:[
            {
            "label":"PPPOE",
            "value":"PPPOE"
          },{
            "label":"IPOE",
            "value":"IPOE"
           },{
                "label":"DHCP",
                "value":"DHCP"
            }
        ],
        dialModeListMap:{
            '0': '不在用',
            '1': '在用'
        },
        cloundList:[
            {
            "label":"NUC",
            "value":"NUC"
            },
            {
            "label":"DSP-1000",
            "value":"DSP-1000"
            },
            {
            "label":"DSP-2000",
            "value":"DSP-2000"
            },
            {
            "label":"DSP-3000",
            "value":"DSP-3000"
             }
        ],
        cloundFPSList:[
            {
                "label":"P24",
                "value":"P24"
            },
            {
                "label":"P25",
                "value":"P25"
            },
            {
                "label":"P30",
                "value":"P30"
            },
            {
                "label":"P50",
                "value":"P50"
            },
            {
                "label":"P60",
                "value":"P60"
            },
            {
                "label":"L50",
                "value":"L50"
            },
            {
                "label":"L60",
                "value":"L60"
            },
            {
                "label":"30",
                "value":"30"
            },
            {
                "label":"60",
                "value":"60"
            },
        ],
        programTypeList:[
            {
                "label":"电视",
                "value":"电视"
            },
            {
                "label":"广播",
                "value":"广播"
            }

        ],
        streamTypeList:[
            {
                "label":"组播",
                "value":"组播"
            },
            {
                "label":"文件",
                "value":"文件"
            }

        ],
        videoTypeList:[
            {
                "label":"H264",
                "value":"H264"
            },
            {
                "label":"H265",
                "value":"H265"
            },
            {
                "label":"AVS+",
                "value":"AVS+"
            },
            {
                "label":"MPEG2",
                "value":"MPEG2"
            },

        ],
        audioTypeList:[
            {
                "label":"AC3",
                "value":"AC3"
            },
            {
                "label":"AAC",
                "value":"AAC"
            },
            {
                "label":"MPEG2",
                "value":"MPEG2"
            },
            {
                "label":"DRA",
                "value":"DRA"
            },
            {
                "label":"MP3",
                "value":"MP3"
            },

        ],
        trackTypeList:[
            {
                "label":"Stereo",
                "value":"Stereo"
            },
            {
                "label":"Left",
                "value":"Left"
            },
            {
                "label":"Right",
                "value":"Right"
            },
        ],
        resolutionTypeList:[
            {
                "label":"HD1080P",
                "value":"HD1080P"
            },
            {
                "label":"HD720P",
                "value":"HD720P"
            },
            {
                "label":"D1",
                "value":"D1"
            },
            {
                "label":"CIF",
                "value":"CIF"
            },
            {
                "label":"4K",
                "value":"4K"
            },
            {
                "label":"其它",
                "value":"其它"
            },
        ],
        harmfulCategoryLiveMap:[],
        harmfulCategoryVodMap:[],
        auditUserList:[], //审核用户
    },
    mutations: {
        updateProvinceData (state, data) {
            state.provinceData = data
        },
        updateProvinceMap (state, data) {
            state.provinceMap = data
        },
        updateDepartmentMap (state, data) {
            state.departmentMap = data
        },
        updateHarmfulCategoryLiveMap (state, data) {
            state.harmfulCategoryLiveMap = data
        },
        updateHarmfulCategoryVodMap (state, data) {
            state.harmfulCategoryVodMap = data
        },
        updateDepartmentTree (state, data) {
            state.departmentTree = data
        },
        updateAreaCodeTree (state, data) {
            state.areaCodeTree = data
        },
        updateFrontTree (state, data) {
            state.frontTree = data
        },
        updateCurrentSelectedFront (state, data) {
            state.currentSelectedFront = data
        },
        updateCurrentSelectedKeyWord (state, data) {
            state.currentSelectedKeyWord = data
        },
        updateCurrentSelectedKey(state, data) {
            state.currentSelectedKey = data
        },
        updateCurrentSelectedKeyVod(state, data) {
            state.currentSelectedKeyVod = data
        },
        updateCurrentBranchCenterList(state, data) {
            state.branchCenterList = data
        },
        updateAuditUserList(state, data) {
            state.auditUserList = data
        },
        updateDepartmentData(state, data) {
            state.departmentData = data
        },
    }
};

export default baseData;
