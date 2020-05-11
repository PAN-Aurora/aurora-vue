<template>
   <div v-if="vodListOption.show">
              <!-- <a-row type="flex" justify="center" >
                    <a-col :span="24" >
                        <label class="form_label" >节目名称：</label>
                        <a-input-search placeholder="请输入节目名称"
                        style="width: 60%" 
                        v-model="vodName"
                        @search="onVodChange" />
                    </a-col>
                </a-row> -->
                  <a-transfer
                     style="margin-top:10px;"
                        :dataSource="mockData"
                        showSearch
                        :listStyle="{
                            width: '200px',
                            height: '250px',
                        }"
                        :operations="['添加', '删除']"
                        :targetKeys="targetKeys"
                        @change="handleChange"
                        :render="item=>`${item.title}`"
                    >
                      
                        <span slot="footer" slot-scope="props"  style="float:right;margin: 5px">
                        右侧为选中节目
                        </span>
                        <span slot="notFoundContent">
                        暂无数据
                        </span>
                </a-transfer>

                <!--分页插件开始-->
                <a-pagination  
                    class="dark_pagination"
                    style="float:right;margin:15px 13%;"
                    @change="onPageChange"
                    :defaultCurrent="1"
                    :pageSize="pagination.pageSize"
                    :total="pagination.total" 
                />
                <!--分页插件结束-->
   </div>
</template>
<script>
export default {
   //props: ["liveListOption"],
   props: {
      vodListOption: {
            type: Object,
            required: true,
      }
  },
  computed: {
    
  },
  created() {
    
  },
  data() {
    return {
        vodName:'',
        orgId:'',
        mockData: [],
        targetKeys: [],
        pagination: { // 分页参数
            current: 1,
            pageSize: 100,
            total:0,
            size: "small",
            showTotal: function(total){
                    return "共"+total+"条"
            }

        },
    };
  },
  methods: {
        init(){
            if(this.vodListOption.orgId){
                this.orgId = this.vodListOption.orgId;
            }
            if(this.vodListOption.mockData){
                this.mockData = this.vodListOption.mockData;
            }
            if(this.vodListOption.pagination){
                Object.assign(this.pagination, this.vodListOption.pagination);
            } 
            if(this.vodListOption.targetKeys){
                this.targetKeys = this.vodListOption.targetKeys;          
            }
            this.getMock();
        },
        //分页切换
        onPageChange(page){
             this.pagination.current = page;
             this.getMock();
         },
         onVodChange(){
             this.getMock();
         },
        //监测频道数据
        async  getMock() {
            if(! this.orgId || this.orgId ==''){
                this.$message.warning('请选择所属终端！');
                return;
            }
            const mockData = [];
            
            let formData = new FormData();
            formData.append('orgId',  this.orgId);
            formData.append('vodName',  this.vodName);
            formData.append('start', this.pagination.current);
            formData.append('limit', this.pagination.pageSize);
            let url =  "/javaApi/dragon.do?method=listVods";
            let res = await this.Request.post(this, url,formData);
            if(res.list && res.list.length>0 ){
                res.list.forEach(item =>{
                    const data = {
                        key: item.vodCode,
                        title: item.vodName,
                        description: item.vodName, 
                    };
                    mockData.push(data);
                })
                this.pagination.total =res.totalCount;
                this.mockData = mockData;   
            }else{
                this.$message.info('暂无节目数据！');
            }
        },
        handleChange(targetKeys, direction, moveKeys) {
            console.log(targetKeys, direction, moveKeys);
            this.targetKeys = targetKeys;

            this.$emit('setVodSelectList',this.targetKeys);  

        },
  },
  components: {
    
  }
};
</script>
<style lang="less" scoped>
 
</style>
