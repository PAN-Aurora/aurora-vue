<template>
  <div>
    <a-divider style="color: white">IPTV监管平台</a-divider>
    <a-tree
      class="dark_tree"
      v-if="treeData.length"
      :treeData="treeData"
      :selectedKeys="selectedKeys"
      :defaultExpandedKeys = "defaultExpandedKeys"
      @select="onSelect"
      @expand="onExpand"
      showIcon
      :loadData="onLoadData"
    >

      <a-icon slot="switcherIcon" type="down" style="color: rgb(202,207,231)" />
      <a-icon slot="file_w" type="file" style="color: white"/>
      <a-icon slot="file_p" type="file" style="color: rgb(202,207,231)" />
    </a-tree>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { POST } from "../utils/restful_util";
import { getAreaList, getLevelList, getOrgList, formatListLong } from '../utils/dataManager/organ_util';
export default {
  props: ["level"],
  data() {
    return {
      checkedKey: "",
      checkedValue: "",
      defaultExpandedKeys: [],
      expandedKeys: [],
      treeData: [],
      selectedKeys: [],
      selectItem: null,
      areaCode: '',
      areaList: [],
      levelList: [],
      orgList: []
    };
  },
  methods: {
    // 选择节点事件
    onSelect(selectedKeys, e) {
      if (e.selected) {
        let selectKey = selectedKeys[0];
        this.expandedKeys.indexOf(selectKey) > -1
          ? ""
          : this.expandedKeys.push(selectKey);
        this.checkedKey = selectKey;
        this.checkedValue = e.node.dataRef.title;
        this.selectItem = { frontId: selectKey, frontName: this.checkedValue, children: e.node.dataRef.children, queryLevel: e.selectedNodes[0].data.props.queryLevel, value: e.selectedNodes[0].data.props.value };

        this.$emit("treeSelect", this.selectItem);

        this.$store.commit('updateCurrentSelectedFront', {key: selectedKeys[0], value: this.checkedValue})

        this.selectedKeys = selectedKeys
        localStorage.setItem('treeItemKey', selectedKeys[0])
        localStorage.setItem('treeItemName', this.checkedValue)
        localStorage.setItem('treeItemValue', e.node.dataRef.value);
      } else {
        let key = e.node.dataRef.key;
        let idx = this.expandedKeys.indexOf(key);
        if (idx > -1) {
          this.expandedKeys.splice(idx, 1);
        }
      }
    },
    // 树展开事件，返回值为当前所展开节点的key集合
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
    },
    // formatTree() {
    //   this.treeData = _.cloneDeep(this.frontTree);
    // },
    getSelectItem() {
      return this.selectItem;
    },
    getTreeData() {
      let trans = {};
      if (this.level) {
        trans.level = this.level;
      }
      POST(this, "/iptv_ln/downBox.do?method=searchMonitorDepartmentTree", trans, res => {
        let arr = [];
        arr.push(res.data.root);
        this.treeData = arr
        this.treeData = this.setTreeIcon(this.treeData);
        this.treeData = this.setTreeLevel(this.treeData,1);
        let key = localStorage.getItem('treeItemKey')
        
        if (key) {

            this.selectItem = {
             frontId: localStorage.getItem('treeItemKey'), 
             frontName: localStorage.getItem('treeItemName')
           }
             this.selectedKeys = [key]
               this.defaultExpandedKeys.indexOf(this.selectItem.frontId) > -1
          ? ""
          : this.defaultExpandedKeys.push(this.selectItem.frontId);
                    
            this.checkedKey = key;
            this.$emit("treeSelect", this.selectItem);
        }
      });
    },
    setTreeIcon(treeData){
      for(let i = 0; i < treeData.length; i++) {
        if(treeData[i].children){
          this.setTreeIcon(treeData[i].children);
        }else{
          if(treeData[i].isLeaf){
            treeData[i].slots= { icon: 'file_w'};
            treeData[i].class='whiteFont';
          }
        }
      }
      return treeData;
    },
    setTreeLevel(treeData,level){
      for(let i = 0; i < treeData.length; i++) {
        if(treeData[i].children){
          if(treeData[i].children.length == 0){
            treeData[i].level = level;
          }else{
            this.setTreeLevel(treeData[i].children,level);
          }
        }else{
          treeData[i].level = level;
        }
      }
      return treeData;
    },
    setChildrenKey(treeData, eventId){
      for(let i = 0; i < treeData.length; i++) {
        treeData[i].key = eventId + '-' + i;
      }
      return treeData;
    },
    onLoadData(treeNode){
      return new Promise(resolve => {
        if(treeNode.dataRef.children && treeNode.dataRef.children > 0){
          resolve();
          return;
        }
        const that = this;
        if(treeNode.dataRef.level == 1){
          getAreaList(that, treeNode.dataRef.manageArea).then(function() {
            let children = formatListLong(that.areaList,2);
            
            children = that.setTreeLevel(children, 2);
            children = that.setChildrenKey(children, treeNode.eventKey);
            children = that.setTreeIcon(children);
            treeNode.dataRef.children = children;
            that.treeData = [...that.treeData];
          });
        }
        if(treeNode.dataRef.level == 2) {
          getLevelList(that, treeNode.dataRef.value).then(function() {
            let children = formatListLong(that.levelList,3);
            
            children = that.setTreeLevel(children, 3);
            children = that.setChildrenKey(children, treeNode.eventKey);
            children = that.setTreeIcon(children);
            treeNode.dataRef.children = children;
            that.treeData = [...that.treeData];
          });
        }
        if(treeNode.dataRef.level == 3) {
          that.areaCode = treeNode.$parent.value;
          getOrgList(that, treeNode.dataRef.value).then(function() {
            let children = formatListLong(that.orgList,4);
            
            children = that.setTreeLevel(children, 3);
            children = that.setChildrenKey(children, treeNode.eventKey);
            children = that.setTreeIcon(children);
            treeNode.dataRef.children = children;
            that.treeData = [...that.treeData];
          });
        }
        resolve();
      });
    }
  },
  mounted() {
    this.getTreeData();
  }
};
</script>
<style lang="less" scoped>
h3 {
  padding: 5px;
  background-color: grey;
}
</style>
<style lang="less">
@import '../customStyle/dartStyle';
</style>