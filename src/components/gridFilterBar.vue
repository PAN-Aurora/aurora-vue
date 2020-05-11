<template>

    <a-row type="flex" justify="space-around" align="middle">
        <!-- <div class="filterRow" v-if="renderOrNot('cascader')">
            <label>{{filterColumns.cascader[0].label}}：</label>
            <a-cascader
                    :options="frontOptions"
                    :loadData="loadOrgData"
                    placeholder="机构信息"
                    class="dark_cascader"
                    popupClassName="dark_cascader_popup divScroll"
                    style="width: 80%;"
                    v-model="orgArr"
                    changeOnSelect
                    @change="getFront"
            />
        </div> -->
        <div class="filterRow" v-if="renderOrNot('basic')||renderOrNot('cascader')">
            <label v-if="renderOrNot('cascader')">{{filterColumns.cascader[0].label}}：</label>
            <a-cascader
                    v-if="renderOrNot('cascader')"
                    :options="frontOptions"
                    :loadData="loadOrgData"
                    :placeholder="filterColumns.cascader[0].label"
                    class="dark_cascader_search"
                    popupClassName="dark_cascader_popup divScroll"
                    style="width: 10%;margin-right:10px;"
                    v-model="orgArr"
                    changeOnSelect
                    @change="getFront"
            />
            <section v-for="(col, idx) in filterColumns.basic" :key="idx" :style="{width:col.sectionWidth || ''}">
                <label for="">{{col.label}}：</label>
                <a-input v-if="col.type === 'input'"  :placeholder="'请输入'+col.label" v-model="filter[col.prop]" :style="{width: col.width || defaultWidth}"></a-input>
                <a-select 
                    class="dark_a_select"
                    dropdownClassName="dark_a_select_option"
                    v-model="filter[col.prop]"
                    v-if="col.type === 'select'"
                    showSearch
                    allowClear
                    :filterOption="filterOption"
                    :placeholder="'请输入'+col.label"
                    :style="{width: col.width || defaultWidth}">
                        <a-select-option v-for="option in col.options" :key="option.value" :value="option.value">{{option.label}}</a-select-option>
                </a-select>

                <a-tree-select
                        allowClear
                        treeDefaultExpandAll
                        @focus="bindEvent(col, 'focus')"
                        v-model="filter[col.prop]"
                        :treeData="col.treeData"
                        :placeholder="col.placeholder || ''"
                        :treeCheckable="col.treeCheckable ? col.treeCheckable : false"
                        v-decorator="col.decorator"
                        v-if="col.type == 'tree'"
                        :style="{width: col.width || defaultWidth}">
                        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                        :autosize="{ minRows: 4, maxRows: 4 }">
                </a-tree-select>
                <a-date-picker 
                    v-if="col.type === 'datetime'"  
                    :placeholder="'请输入'+col.label" 
                    showTime 
                    format="YYYY-MM-DD HH:mm:ss" 
                    :style="{width: col.width || defaultWidth}" 
                    v-model="filter[col.prop]" 
                    @change="formatMoment(col)"/>

                <a-range-picker
                 v-if="col.type === 'rangePicker'" 
                 :showTime="{ format: 'HH:mm:ss' }"
                 class="dark_date_range_picker"
                 format="YYYY-MM-DD HH:mm:ss"
                 :placeholder="col.placeholder" 
                  v-model="filter[col.prop]" 
                  :style="{width: col.width || defaultWidth}" 
                  @change="formatMomentRange(col)"
                />
            </section>
            <section>
                <a v-if="renderOrNot('advance')" class="adva" @click="collapse = !collapse">
                    高级搜索
                    <a-icon type="down" v-if="collapse"/>
                    <a-icon type="up" v-else/>
                </a>
                <a-divider type="vertical" dashed />
                <a-button type="primary" icon="search" @click="searchResult">查询</a-button>
                <a-divider type="vertical" dashed />
                <a-button type="primary" icon="undo" @click="restSearch">重置</a-button>
            </section>
        </div>
        <transition name="slide-fade">
            <div class="filterRow adrow" v-if="!collapse">
                <section v-for="(col, idx) in filterColumns.advance" :key="idx">
                    <label for="">{{col.label}}</label>
                    <a-input class="inputCommon queryInput" v-if="col.type === 'input'" v-model="filter[col.prop]" :style="{width: col.width || defaultWidth, fontSize: '14px'}"></a-input>
                    <a-config-provider>
                        <template v-slot:renderEmpty>
                            <div style="text-align: center;">
                            <p style="color:lightgray">暂无数据</p>
                            </div>
                        </template>
                        <a-select 
                            class="dark_a_select"
                            dropdownClassName="dark_a_select_option"
                            v-if="col.type === 'select'" 
                            v-model="filter[col.prop]" 
                            showSearch
                            allowClear
                            :filterOption="filterOption"  
                            :style="{width: col.width || defaultWidth}">
                                <a-select-option v-for="option in col.options" :key="option.value" :value="option.value">{{option.label}}</a-select-option>
                        </a-select>
                    </a-config-provider>
                    <a-date-picker v-if="col.type === 'datetime'" showTime format="YYYY-MM-DD HH:mm" :style="{width: col.width || defaultWidth}" v-model="filter[col.prop]"/>


                </section>
            </div>
        </transition>
    </a-row>
</template>
<script>
import { org_mixin } from '../maxin/org_mixin'
export default {
    mixins: [org_mixin],
    props: ['filterColumns'],
    data () {
        return {
            collapse: true,
            filter: {},
            defaultWidth: '150px',
            customStyle: 'border: 0;overflow: hidden'
        }
    },
    methods: {
        //搜索
        searchResult () {
            this.$emit('query', this.filter)
        },
        //重置
        restSearch(){
            
             let _this = this;
             console.info(_this.filter);
              if(_this.filter){
                  Object.keys(_this.filter).forEach(function(key){
                      _this.filter[key] = "";
                  });
              }
        },
        bindEvent(item, type) {
            if (item[type]) {
                this.$nextTick(() => {
                    let val = this.form.getFieldValue(item.dataIndex);
                    return item[type](val);
                });
            } else {
                return function() {};
            }
        },
        renderOrNot (type) {
            let flag = false
            if (this.filterColumns && this.filterColumns[type]) {
                if (this.filterColumns[type].length > 0) {
                    flag = true
                }
            }
            return flag
        },
        filterOption(input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        formatMoment(col){ // 判断日期组件内容是否需要进行格式转换
            if(col.needFormat){
                let str = "";
                if(this.filter[col.prop] !== null){
                    str = this.filter[col.prop].format('YYYY-MM-DD HH:mm:ss');
                }
                let fieldName = col.prop.substring(0, col.prop.length - 6); // 删除原字段名的Moment作为新字段名
                this.filter[fieldName] = str;
            }
        },
        formatMomentRange(col){
            console.info(this.filter[col.prop]);
            if(col.needFormat){
                if(this.filter[col.prop] !== null){
                    let  str = this.filter[col.prop][0].format('YYYY-MM-DD HH:mm:ss');
                    let str1 = this.filter[col.prop][1].format('YYYY-MM-DD HH:mm:ss');
                    this.filter[col.needFormatProp[0]] = str;
                    this.filter[col.needFormatProp[1]] = str1;
                    console.info(this.filter);
                }
            }
        }
    },
    created () {
        let filterFormat = {}
        for (let col in this.filterColumns) {
            this.filterColumns[col].forEach((item) => {
                if (['datetime', 'daterange'].indexOf(item.type) > -1) {
                    filterFormat[item.prop] = null
                } else {
                    filterFormat[item.prop] = ''
                }
            })
        }
        this.$set(this, 'filter', filterFormat)
        if(this.renderOrNot('cascader')){
            this.orgMount = true;
        }
    }
}
</script>
<style lang="less" scoped>
.adva{
    margin:0 1em;
}
.adrow{
    margin-top: 1em;
}
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.filterRow{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-top:10px;
    margin-bottom:10px;
}
.filterRow label{
    margin: 0;
    color: rgb(192,200,232);
}
</style>

