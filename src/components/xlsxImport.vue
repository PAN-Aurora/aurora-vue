<template>
    <div style="margin-left: 0.5em">
        <a-button :icon="option.icon || ''"
                  class="success"
                  @click="visible = true"
                  :size="option.size || 'large'">{{option.text || ''}}</a-button>
        <a-modal
                title="导入"
                v-model="visible"
                :maskClosable="false" :width="option.modalWidth || 1200">
            <div class="outer" @drop="handleDrop" @dragover.prevent>
                <h3 style="width: 100%;text-align: center">拖拽您想要上传的文件到此处或
                    <a-upload name="file" :beforeUpload="handleBeforeUpload" :showUploadList="false">
                        <a-button>
                            <a-icon type="upload" /> 上传
                        </a-button>
                    </a-upload>
                </h3>
                <div>
                    <a-icon type="down-square" :style="{fontSize: '20px'}"/>
                </div>
            </div>
            <a-divider orientation="left">导入文件数据展示</a-divider>
            <a-table bordered :dataSource="dataSource" :columns="tableOption.columns" :pagination="false" id="table1">
                <template v-for="(col, idx) in tableOption.columns" :slot="col.dataIndex" slot-scope="text, record">
                    <editable-cell :key="idx" :text="text" @change="onCellChange(record.key, col.dataIndex, $event)"/>
                </template>
            </a-table>
            <template slot="footer">
                <a-button type="primary" @click="exportTemplate">模板下载</a-button>
                <a-button class="success" @click="importData">导入</a-button>
                <a-button @click="handleCancel">关闭</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
    import XLSX from 'xlsx'
    import EditableCell from './EditableCell'
    import moment from 'moment'
    import {POST} from '../utils/restful_util'
    import {info, warning} from '../utils/alert_util'
    import Bus from '../utils/bus'
    export default {
        /*
        * {
        *   text: '',
        *   icon: '',
        *   style: {},
        *   shape: '',   // circle
        *   size: '',     // small   large
        *   modalWidth: '' //default: 1200
        * }
        * */
        props: ['option', 'tableOption', 'frontId'],
        components: {
            EditableCell
        },
        data () {
            return {
                visible: false,
                dataSource: []
            }
        },
        methods: {
            importData () {
                let trans = {
                    frontId: this.frontId,
                    channelList: this.formatData(this.dataSource)
                }
                POST(this, '/api/front/channelImport', trans, (res) => {
                    if (res.code === 1) {
                        info(this, res.message)
                        Bus.$emit('importSuccess', {frontId: this.frontId})
                    } else {
                        warning(this, res.message)
                    }
                })
            },
            formatData (data) {
                let items = _.cloneDeep(data)
                let checkedKeys = _.filter(this.tableOption.columns, {type: 'switch'}).map((item)=> {
                    return item.dataIndex
                })
                items.forEach((item) => {
                    for(let prop in item) {
                        if (checkedKeys.indexOf(prop) > -1) {
                            if (item[prop].trim() === '是') {
                                item[prop] = '1'
                            } else {
                                item[prop] = '0'
                            }
                        }
                    }
                })
                return items
            },
            onCellChange (key, dataIndex, value) {
                const dataSource = [...this.dataSource]
                const target = dataSource.find(item => item.key === key)
                if (target) {
                    target[dataIndex] = value
                    this.dataSource = dataSource
                }
            },
            handleCancel () {
                this.visible = false
            },
            handleBeforeUpload (f) {
                this.analysisFile(f)
                return false
            },
            handleDrop (e) {
                e.stopPropagation(); e.preventDefault();
                let f = e.dataTransfer.files[0]
                console.log(f)
                this.analysisFile(f)
            },
            analysisFile (f) {
                this.dataSource = []
                let _this = this
//                this.importFileName = f.name
                let reader = new FileReader() // 重写FileReader上的readAsBinaryString方法
                FileReader.prototype.readAsBinaryString = function (f) {
                    let binary = ''
                    let wb = null
                    let outdata = []
                    let reader = new FileReader()
                    reader.onload = function () {
                        let bytes = new Uint8Array(reader.result)
                        let length = bytes.byteLength
                        for (let i = 0; i < length; i++) {
                            binary += String.fromCharCode(bytes[i])
                        }
                        wb = XLSX.read(binary, {type: 'binary'})
                        for (let i = 0; i < wb.SheetNames.length; i++) {
                            let sheet = {
                                sheetName: wb.SheetNames[i],
                                data: null,
                            }
                            sheet.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[i]])
                            outdata.push(sheet)
                        }
                        let formatData = []
                        outdata.forEach((sheet) => {
                            sheet.data.forEach((row) => {
                                let format = {}
                                for(let prop in row) {
                                    let col = __.find(_this.tableOption.columns, {title: prop})
                                    if (col) {
                                        if (prop.indexOf('时间') > -1) {
                                            format[col.dataIndex] = moment(new Date(1900, 0, row[prop] - 1)).format('YYYY-MM-DD')
                                        } else {
                                            format[col.dataIndex] = row[prop]
                                        }
                                    }
                                }
                                formatData.push(format)
                            })
                        })
                        _this.dataSource = formatData
                    }
                    reader.readAsArrayBuffer(f)
                }
                reader.readAsBinaryString(f)
                return false
            },
            exportTemplate () {
                let table1 = document.querySelector("#table1");
                let sheet = XLSX.utils.table_to_sheet(table1);//将一个table对象转换成一个sheet对象
                this.openDownloadDialog(this.sheet2blob(sheet),'下载.xlsx');
            },
            openDownloadDialog(url, saveName) {
                if (typeof url == 'object' && url instanceof Blob) {
                    url = URL.createObjectURL(url); // 创建blob地址
                }
                let aLink = document.createElement('a');
                aLink.href = url;
                aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
                let event;
                if (window.MouseEvent) event = new MouseEvent('click');
                else {
                    event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                }
                aLink.dispatchEvent(event);
            },
            sheet2blob(sheet, sheetName) {
                sheetName = sheetName || 'sheet1';
                let workbook = {
                    SheetNames: [sheetName],
                    Sheets: {}
                };
                workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

                let wopts = {
                    bookType: 'xlsx', // 要生成的文件类型
                    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
                    type: 'binary'
                };
                let wbout = XLSX.write(workbook, wopts);
                let blob = new Blob([s2ab(wbout)], {
                    type: "application/octet-stream"
                }); // 字符串转ArrayBuffer
                function s2ab(s) {
                    let buf = new ArrayBuffer(s.length);
                    let view = new Uint8Array(buf);
                    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
                return blob;
            }
        }
    }
</script>
<style lang="less" scoped>
    .outer{
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed lightgrey;
        border-radius: 5px;
        height: 100px;
        flex-wrap: wrap;
        margin-bottom: 1em;
    }
</style>