<template>
  <div class="mock-form">
    <!-- {{params_user_info}} -->
    <!-- 第一步 -->
    <div v-show="step===1">
      <el-radio-group v-model="selected_coin_type" class="group-select">
        <el-radio border :label="coin" v-for="coin in cur_coins" :key="coin">{{coin|uppercase}}</el-radio>
      </el-radio-group>
      <h3 class="mt25">请选择地区节点</h3>
      <ul class="region-list">
        <li v-for="(region,i) in all_regions" :key="region.region_id" flex="main:justify">
          <h5>{{$t('m.'+region.region_id)}}</h5>
          <p v-show="daily[i]!==0">日算力：<b class="v">{{daily[i]}}</b><b class="unit">{{unit[i]}}H/s</b></p>
          <p v-show="daily[i]===0">无算力</p>
          <el-button type="text" v-show="daily[i]!==0" @click="goStep2(region.region_id,daily[i],unit[i])">设置</el-button>
        </li>
      </ul>
      <p class="mt50 f-tar color-gray">此处的日算力数据为前一个自然日您的算力统计</p>
    </div>
    <!-- 第二步 -->
    <div v-show="step===2">
      <h2 class="title s3">{{selected_coin_type|uppercase}}-{{$t('m.'+selected_region_id)}}-报警设置</h2>
      <el-form :model="form1_model" :rules="form1_rules" ref="form1_ref" label-width="250px" label-position="left" @submit.native.prevent>
        <el-form-item prop="isHashrate" label="算力报警" :class="form1_model.isHashrate?'':'color-gray'">
          <el-switch v-model="form1_model.isHashrate"></el-switch>
        </el-form-item>
        <el-form-item prop="hashrate" label="算力警戒线" class="color-gray">
          <el-input placeholder="" v-model="form1_model.hashrate">
            <template slot="append">{{selected_unit}}H/s</template>
          </el-input>
        </el-form-item>

        <el-form-item prop="isMinersNumber" label="矿机数量报警" :class="form1_model.isMinersNumber?'':'color-gray'">
          <el-switch v-model="form1_model.isMinersNumber"></el-switch>
        </el-form-item>
        <el-form-item label="活跃矿机数量警戒线" class="color-gray">
          <el-input-number v-model="form1_model.minersNumber" placeholder=""></el-input-number>
        </el-form-item>

        <el-form-item label="报警频率"></el-form-item>
        <el-form-item prop="alarmFrequency" label="同一事件下两次报警最小间隔" class="color-gray">
          <el-select v-model="form1_model.alarmFrequency" placeholder="请选择">
            <el-option v-for="item in form1_model.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <div class="f-tac mt30"><el-button type="primary" style="width:200px;" @click="submitForm('form1_ref')">下一步</el-button></div>

      </el-form>
    </div>
    <!-- 第三步 -->
    <div v-show="step===3">

    </div>
  </div>
</template>

<script>
  import fn from '@/assets/js/function'
  export default {
    components: {},
    props: ['params_puid', 'params_coin_type', 'params_user_info'],
    data() {
      var checkHashrate = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('算力警戒线不能为空'))
        }
        if(isNaN(value)) {
          callback(new Error('只能输入数字'))
        }else if(value>this.cur_hashrate) {
          callback(new Error('算力警戒线值不能超过最大值'+this.cur_hashrate))
        }else{
          callback()
        }
      };
      return {
        step: 1,
        selected_coin_type: '', // 已经选择的币种
        selected_region_id: '',
        selected_unit: '',
        cur_hashrate:0,
        form1_model: {
          isHashrate: false,
          hashrate: '',
          isMinersNumber: false,
          minersNumber: 0,
          alarmFrequency: 1,
          options: [{
            value: 1,
            label: '1小时'
          }, {
            value: 2,
            label: '2小时'
          }, {
            value: 3,
            label: '3小时'
          }],
        },
        form1_rules: {
          hashrate: [{
            validator: checkHashrate,
            trigger: 'blur'
          }]
        },
        all_regions: [], // 已经选择的币种支持的节点列表
        daily: [100, 0], // ??节点日算力数据
        unit: ['G', 'M'], // ??单位
      }
    },
    computed: {
      cur_coins: function () {
        return this.$store.state.cur_coins
      }
    },
    watch: {
      selected_coin_type: function () {
        fn.getAllRegionByCoin(this.selected_coin_type).then(res => {
          this.all_regions = res;
        })
      },
      params_coin_type: function () {
        return this.selected_coin_type = this.params_coin_type
      }
    },
    mounted() {
      console.log('4mounted')
      this.selected_coin_type = this.params_user_info.default_coin_type
    },
    methods: {
      init: function () {
        this.step = 1;
        this.selected_coin_type = this.params_user_info.default_coin_type
      },
      goStep2: function (region_id, hashrate, unit) {
        console.log(region_id, hashrate, unit);
        this.cur_hashrate=hashrate;
        this.selected_region_id = region_id;
        this.selected_unit = unit;
        this.step = 2;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
  }
</script>
