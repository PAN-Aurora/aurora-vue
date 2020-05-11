<template>
   <div v-if="liveListOption.show">
                  <a-transfer
                     style="margin-top:10px;"
                        :dataSource="mockData"
                        showSearch
                        :listStyle="{
                            width: '200px',
                            height: '400px',
                        }"
                        :operations="['添加', '删除']"
                        :targetKeys="targetKeys"
                        @change="handleChange"
                        :render="item=>`${item.title}`"
                    >
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
      liveListOption: {
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
        orgId:'',
        mockData: [],
        targetKeys: [],
        pagination: { // 分页参数
            current: 1,
            pageSize: 30,
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
            if(this.liveListOption.orgId){
                this.orgId = this.liveListOption.orgId;
            }
            if(this.liveListOption.mockData){
                this.mockData = this.liveListOption.mockData;
            }
            if(this.liveListOption.pagination){
                Object.assign(this.pagination, this.liveListOption.pagination);
            }
            this.getMock();
        },
        //分页切换
        onPageChange(page){
             this.pagination.current = page;
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
            formData.append('page', this.pagination.current);
            formData.append('pageSize', this.pagination.pageSize);
            let url =  "/javaApi/programQuality.do?method=SelectChannelListByOrgId";
            let res = await this.Request.post(this, url,formData);
            
            res.list.forEach(item =>{
                    const data = {
                        key: item.channelId,
                        title: item.channelName,
                        description: item.channelName, 
                    };
                    
                    mockData.push(data);
                })

            this.pagination.total =res.total;
            this.mockData = mockData;   
        },
        handleChange(targetKeys, direction, moveKeys) {
            console.log(targetKeys, direction, moveKeys);
            this.targetKeys = targetKeys;

            this.$emit('setLiveSelectList',this.targetKeys);  

        },
  },
  components: {
    
  }
};
</script>
<style lang="less" scoped>
 
</style>
