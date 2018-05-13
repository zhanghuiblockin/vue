<!--矿机管理页面->
<template>
  <div class="wrap pb70">
    <div v-title class="hide-title">{{$t('m.tit9')}}</div>
    <el-breadcrumb class="mt30 mb30" separator="/">
      <el-breadcrumb-item>{{$t('m.shouye')}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{name: 'my_puid_cointype'}" v-if="$store.state.read_token.length==0">{{cur_account.data.name}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{name: 'my_puid_cointype',query:{read_token:$store.state.read_token}}" v-else>{{cur_account.data.name}}</el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-dropdown @command="handleRegion" trigger="click">
          <span class="el-dropdown-link" style="cursor:pointer">{{$t('m.'+$route.params.region_id)}}<i class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="region in regions" :key="region.region_id" :command="region">
              <span>{{$t('m.'+region.region_id)}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('m.kuangji')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!--     <div class="box mt30 f-cb mb30">
            <table class="test">
              <tbody>
                <tr>
                  <td>api:</td>
                  <td>{{api}}</td>
                </tr>
                <tr>
                  <td>puid:</td>
                  <td>{{$route.params.puid}}</td>
                </tr>
                <tr>
                  <td>group_id:</td>
                  <td>{{group_id}}</td>
                </tr>
                <tr>
                  <td>status:</td>
                  <td>{{status}}</td>
                </tr>
                <tr>
                  <td>order_by:</td>
                  <td>{{order_by}}</td>
                </tr>
                <tr>
                  <td>sort:</td>
                  <td>{{sort}}</td>
                </tr>
                <tr>
                  <td>multipleSelection:</td>
                  <td>{{multipleSelection}}</td>
                </tr>
                <tr>
                  <td>keyword:</td>
                  <td>{{keyword}}</td>
                </tr>
                <tr>
                  <td>page_size:</td>
                  <td>{{page_size}}</td>
                </tr>
                <tr>
                  <td>total:</td>
                  <td>{{total}}</td>
                </tr>
                <tr>
                  <td>操作提示:</td>
                  <td>{{tips}}</td>
                </tr>
              </tbody>
            </table>
          </div> -->
<el-row :gutter="40" class="f-cb">
  <el-col :span="5">
    <div class="box">
      <ul class="side">
        <li :class="sideIndex==0?'active':''" @click="sideClick(0,0,'全部')">{{$t('m.quanbu')}}</li>
        <li :class="sideIndex==-1?'active':''" @click="sideClick(-1,-1,'默认分组')">{{$t('m.morenfenzu')}}</li>
        <li v-for="(item,index) in sideGroup" :key="item.group_id" :class="sideIndex==(index+1)?'active':''" @click="sideClick(index+1,item.group_id,item.name)">{{item.name}}</li>
      </ul>
      <div class="f-tac p10" v-if="$store.state.read_token.length==0">
        <p class="p5">
          <button class="btn big color-blue" @click="add_dialog"><i class="iconfont icon-jiajianchengchu-1"></i> {{$t('m.tianjiafenzu')}}</button>
        </p>
        <p class="p5" v-if="sideIndex>0">
          <button class="btn big color-red" @click="delGroup(group_id,group_name)"><i class="iconfont icon-jiajianchengchu-"></i> {{$t('m.shanchufenzu')}}</button>
        </p>
      </div>
    </div>
  </el-col>
  <el-col :span="19">
    <div class="box f-pr">
      <div class="miners-bar">
        <ul class="f-cb">
          <li :class="status=='ALL'?'active':''" @click="tabClick('ALL')">{{$t('m.quanbu')}} ({{tableData.workers_active+tableData.workers_dead+tableData.workers_inactive}})
            <el-tooltip class="item" effect="dark" placement="bottom">
              <div slot="content" v-html="$t('m.tips6')"></div><i class="el-icon-warning"></i></el-tooltip>
          </li>
          <li :class="status=='ACTIVE'?'active':''" @click="tabClick('ACTIVE')">{{$t('m.huoyue')}} ({{tableData.workers_active}})</li>
          <li :class="status=='INACTIVE'?'active':''" @click="tabClick('INACTIVE')">{{$t('m.buhuoyue')}} ({{tableData.workers_inactive}})</li>
          <li :class="status=='DEAD'?'active':''" @click="tabClick('DEAD')">{{$t('m.shixiao')}} ({{tableData.workers_dead}})</li>
        </ul>
      </div>
      <div class="p15">
        <el-table ref="multipleTable" :data="tableData.data" tooltip-effect="dark"  style="width: 100%" @selection-change="handleSelectionChange" @sort-change="sortChange" v-loading="loading" :empty-text="$t('m.nodata')">
          <el-table-column prop="worker_name" :label="$t('m.kuangjiming')" width="120" sortable="custom" align="center">
            <template slot-scope="scope">
              <router-link v-if="$store.state.read_token.length==0" style="cursor:pointer;" class="color-blue" :to="{name:'my_minners_show',params:{puid:puid,coin_type:coin_type,region_id:region_id,worker_id:scope.row.worker_id}}">{{scope.row.worker_name === '__default__' ? '未命名' : scope.row.worker_name}}</router-link>
              <router-link v-else style="cursor:pointer;" class="color-blue" :to="{name:'my_minners_show',params:{puid:puid,coin_type:coin_type,region_id:region_id,worker_id:scope.row.worker_id},query:{read_token:$store.state.read_token}}">{{scope.row.worker_name === '__default__' ? '未命名' : scope.row.worker_name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="shares_15m" :label="$t('m.shishisuanli')" sortable="custom" align="right">
            <template slot-scope="scope">
              {{ scope.row.shares_15m }} {{ scope.row.shares_unit }}H/s
            </template>
          </el-table-column>
          <el-table-column prop="shares_24h" :label="$t('m.risuanli')" align="right" sortable="custom" v-if="hideCol">
            <template slot-scope="scope">
              {{ scope.row.shares_24h }} {{ scope.row.shares_unit }}H/s
            </template>
          </el-table-column>
          <el-table-column prop="accept_count" :label="$t('m.jieshoushu')" align="right"></el-table-column>
          <el-table-column prop="reject_rate" :label="$t('m.jvjuelv')" align="right" sortable="custom">
            <template slot-scope="scope">
              <p class="f-tar">
                {{ scope.row.reject_rate | formatPercent2 }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="last_share_time" :label="$t('m.zuijintijiaoshijian')" width="180" align="center" sortable="custom">
            <template slot-scope="scope">
              <span :class="scope.row.status!='ACTIVE'?'color-red':''">{{ scope.row.last_share_time | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" :label="$t('m.zhuangtai')" align=center width="80">
            <template slot-scope="scope">
              <span class="state-dot" :class="scope.row.status=='ACTIVE'?'green':'red'" :title="scope.row.status=='ACTIVE'?'活跃':'失效'"></span>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="50" v-if="$store.state.read_token.length==0"></el-table-column>
        </el-table>
      </div>
      <span class="sch" v-if="multipleSelection.length==0"><el-input v-model="keyword" :placeholder="$t('m.sousuokuangji')" size="mini" @keyup.enter.native="search"><el-button type="primary" slot="append" @click="search">{{$t('m.sousuo')}}</el-button></el-input></span>
      <span class="fn-bar" v-else>
              <el-button type="primary" size="mini" @click="handleDel">{{$t('m.shanchu')}}</el-button>
              <el-dropdown @command="handleMove">
                <el-button type="primary" size="mini">
                  {{$t('m.yidongdao')}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command=-1>{{$t('m.morenfenzu')}}</el-dropdown-item>
                  <el-dropdown-item v-for="group in sideGroup" :key="group.group_id" :command="group.group_id">{{group.name}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </span>
      <div class="pt5 pb20 f-tac">
        <el-pagination background layout="prev, pager, next" :total="total" :page-size="page_size" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>
  </el-col>
</el-row>
<el-dialog custom-class="my-dialog" :title="$t('m.tianjiafenzu')" :lock-scroll="false" :visible.sync="addDialogVisible">
  <el-input :placeholder="$t('m.tips34')" v-model='addName'></el-input>
  <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="groupCreate">{{$t('m.tianjia')}}</el-button>
            </span>
</el-dialog>
</div>
</template>
<script>
  import fn from '@/assets/js/function.js'
  import { mapState } from 'vuex'
  export default {
    name: 'my_minners',
    data() {
      return {
        region_id: '',
        puid: '',
        coin_type: '',
        regions: [],
        cur_region: {
          region_id: '',
          text_en: '',
          'text_zh-cn': ''
        },
        cur_account: {
          data: {
            name: ''
          }
        },
        sideGroup: [], // 分组数据
        group_id: 0, // 默认为全部
        group_name: '', // 切换自定义分组名
        status: 'ALL', // 默认当前状态
        sideIndex: 0, // 默认side为'全部'
        addName: '', // 添加分组名称
        addDialogVisible: false, // 默认添加分组弹窗隐藏
        api: '', // 当前api路径(币种，节点中获取)
        tableData: {
          workers_active: 0,
          workers_dead: 0,
          workers_inactive: 0
        }, // 右侧表格相关数据
        multipleSelection: [], // 选择项
        order_by: 'worker_name',
        sort: 'asc',
        keyword: '',
        tips: '', // 操作提示
        language: localStorage.getItem('language'),
        region_name: '',
        page_size: 30, // 设定显示每页数;
        total: 0,
        page: 1,
        hideCol: 0,
        loading: true
      };
    },
    methods: {
      handleCurrentChange(v) {
        self = this;
        console.log('currentChange', v);
        self.page = v;
        self.loading = true;
        fn
          .sortWorkder(this.api, this.puid, this.group_id, this.status, this.order_by, this.sort, this.page, this.page_size)
          .then(res => {
            if (res.data.err_no == 0) {
              self.tableData = res.data.data;
              self.total = res.data.data.total_count;
            } else {
              this.$message.error(this.$t('m.tips35'));
            }
            self.loading = false;
          });
      },
      handleRegion(command) {
        let self = this;
        $store.commit('setRegionId', command.region_id);
        this.$route.params.region_id = command.region_id;
        // if (self.language == 'zh-CN') {
        //   self.region_name = command['text_zh-cn'];
        // }
        // if (self.language == 'en-US') {
        //   self.region_name = command['text_en'];
        // }
        if ($store.state.read_token.length != 0) {
          $router.replace({
            name: 'my_dashboard',
            params: this.$route.params,
            query: {
              read_token: localStorage.getItem('read_token')
            }
          });
        } else {
          $router.replace({
            name: 'my_dashboard',
            params: this.$route.params
          });
        }
      },
      // 右侧表格选择方法
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 弹出添加分组弹层
      add_dialog: function () {
        this.addDialogVisible = true;
      },
      // 分组点击事件
      sideClick(sideIndex, group_id, group_name) {
        let self = this;
        self.loading = true;
        this.sideIndex = sideIndex;
        this.group_id = group_id;
        this.group_name = group_name;
        this.status = 'ALL';
        this.tips = '重新获取当前group_id:' + this.group_id + '且名字为' + this.group_name + '的矿机数据！self.tableData = res.data.data';
        self.getWorker();
      },
      // 排序方法
      sortChange(column) {
        let self = this;
        self.loading = true;
        if (column.prop == null || column.order == null) {
          this.order_by = '';
          this.sort = '';
          self.loading = false;
          self.getWorker();
        } else {
          this.order_by = column.prop;
          if (column.order == 'ascending') {
            this.sort = column.order.slice(0, 3);
          } else {
            this.sort = column.order.slice(0, 4);
          }
          this.tips = '点击了排序更新self.tableData';
          fn
            .sortWorkder(this.api, this.puid, this.group_id, this.status, this.order_by, this.sort, this.page, this.page_size)
            .then(res => {
              if (res.data.err_no == 0) {
                self.tableData = res.data.data;
                self.total = res.data.data.total_count;
              } else {
                this.$message.error(this.$t('m.tips35'));
              }
              self.loading = false;
            });
        }
      },
      // 更新状态并获取表格渲染数据
      tabClick(status) {
        let self = this;
        self.loading = true;
        this.status = status;
        this.tips = '点击了选项卡,且status=' + this.status + '更新self.tableData';
        this.page = 1;
        self.getWorker();
      },
      // 开始搜索
      search() {
        let self = this;
        self.loading = true;
        this.status = 'ALL';
        this.tips = '点击了搜索：' + this.keyword + '更新self.tableData';
        if (this.keyword == '') {
          this.$message.error(this.$t('m.tips42'));
          this.loading = false;
          return false;
        }
        fn.searchWorker(this.api, this.puid, this.group_id, this.keyword, this.page_size)
          .then(res => {
            if (res.data.err_no == 0) {
              self.tableData = res.data.data;
              self.total = res.data.data.total_count;
            } else {
              this.$message.error(this.$t('m.tips41'));
            }
            self.loading = false;
          });
      },
      // 移动事件
      handleMove(command) {
        let self = this;
        this.tips = '将这条记录移动到分组' + command + '并更新self.tableData';
        let worker_ids = [];
        _.each(self.multipleSelection, function (v, i) {
          worker_ids.push(v.worker_id);
        });
        let params = {
          group_id: command,
          worker_ids: worker_ids
        };
        fn.modifyWorkerGroup(self.api, self.puid, params).then(res => {
          if (res.data.err_no == 100) {
            self.$message.error(this.$t('m.tips40'));
          } else {
            self.$message.success(this.$t('m.tips39'));
            self.getWorker();
          }
        });
      },
      // 删除矿机
      handleDel() {
        let self = this;
        let num = 0;
        _.each(self.multipleSelection, function (v) {
          if (v.status == 'ACTIVE') {
            num++;
          }
        });
        if (num > 0) {
          this.$message.error(this.$t('m.tips38'));
        }
        if (num == 0) {
          this.$confirm(this.$t('m.isdel'), this.$t('m.tishi'), {
            confirmButtonText: this.$t('m.shanchu'),
            cancelButtonText: this.$t('m.qvxiao'),
            lockScroll: false,
            type: 'warning'
          })
            .then(() => {
              let worker_ids = [];
              _.each(self.multipleSelection, function (v, i) {
                worker_ids.push(v.worker_id);
              });
              let params = {
                worker_ids: worker_ids,
                group_id: 0
              };
              fn.modifyWorkerGroup(self.api, self.puid, params).then(res => {
                self.getWorker();
                this.$message.success(this.$t('m.shanchuchenggong'));
              });
              this.tips = '本矿机已经被删除，请更新self.tableData';
            })
          // .catch(() => {
          //   this.$message({
          //     type: 'info',
          //     message: this.$t('m.canceldel')
          //   });
          // });
        }
      },
      pageInit() {
        self = this;
        this.puid = this.$route.params.puid;
        this.coin_type = this.$route.params.coin_type;
        this.region_id = this.$route.params.region_id;
        this.language = localStorage.getItem('language');
        if ($store.state.read_token.length != 0) {
          this.cur_account.data.name = localStorage.getItem(
            'read_subaccount_name'
          );
        } else {
          //获取userName
          fn.getSubAccountById(this.puid).then(res => {
            this.cur_account = res.data;
          });
        }
        //获取所有节点
        fn.getAllRegions().then(res => {
          this.regions = res;
          //console.log('所有节点regions:', res);
        });
        //获取当前节点信息
        // fn.getRegionInfo(self.region_id).then(res => {
        //   if (self.language == 'zh-CN') {
        //     this.region_name = res['text_zh-cn'];
        //   }
        //   if (self.language == 'en-US') {
        //     this.region_name = res['text_en'];
        //   }
        // });
        //自动获取分组信息
        self.getGroup();
      },
      //获取分组
      getGroup() {
        let self = this;
        fn.getApiBaseUrl(self.region_id, self.coin_type).then(api => {
          this.api = api;
          fn.getGroup(api, self.puid).then(res => {
            if (res.err_no == 0) {
              self.sideGroup = res.data;
            } else {
              this.$message.error(this.$t('m.tips47'));
            }
            self.getWorker();
          });
        });
      },
      //创建分组
      groupCreate() {
        let re = /^[a-zA-Z0-9\-_]{3,20}$/;
        if (this.addName != '' && re.test(this.addName)) {
          let params = {
            name: this.addName
          };
          fn.createGroup(self.api, self.puid, params).then(res => {
            self.getGroup();
            this.$message.success(this.$t('m.tips46'));
            self.addDialogVisible = false;
          });
        } else {
          this.$message.error(this.$t('m.tips45'));
        }
      },
      //删除分组
      delGroup(group_id, group_name) {
        this.$confirm(this.$t('m.tips43') + group_name + this.$t('m.tips44'), this.$t('m.shanchu'), {
          confirmButtonText: this.$t('m.queding'),
          cancelButtonText: this.$t('m.qvxiao'),
          lockScroll: false,
          type: 'warning'
        })
          .then(() => {
            fn.delGroup(self.api, self.group_id, self.puid).then(res => {
              this.$message.success(this.$t('m.tips37'));
              self.getGroup();
              self.sideIndex = 0;
              self.group_id = 0;
              self.getWorker();
            });
          })
        // .catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: this.$t('m.canceldel')
        //   });
        // });
      },
      //获取指定矿机列表
      getWorker() {
        let self = this;
        let api = self.api;
        fn
          .getWorker(api, self.puid, self.group_id, self.status, self.page_size)
          .then(res => {
            if (res.data.err_no == 0) {
              self.tips = '矿机数据获取完毕！更新self.tableData = res.data.data';
              self.tableData = res.data.data;
              try {
                if (res.data.data.data[0].hasOwnProperty('shares_24h')) {
                  self.hideCol = 1;
                } else {
                  self.hideCol = 0;
                }
              } catch (e) {
                self.hideCol = 0;
              }
              self.total = res.data.data.total_count;
            } else {
              this.$message.error(this.$t('m.tips36'));
              $router.replace({
                name: 'my_puid_cointype',
                path: '/my/' + self.$route.params.puid + '/' + self.$route.params.coin_type
              });
            }
            self.loading = false;
          });
      },
      pageInitInterval() {
        let self = this;
        clearInterval(window.dingshiqi);
        self.pageInit();
        window.dingshiqi = setInterval(function () {
          self.pageInit();
        }, $store.state.refresh_time);
      }
    },
    mounted() {
      this.pageInit();
    },
    computed: {},
    watch: {
      $route(to, from) {
        this.pageInit();
      }
      // refresh(v) {
      //   this.pageInit()
      // }
    }
  };
</script>
<style>
  .el-tabs--border-card {
    border: none;
    box-shadow: none !important;
    border: none !important;
  }
  .el-table .sort-caret {
    right: 0;
  }
</style>
