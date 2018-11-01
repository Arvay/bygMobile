<template>
  <div style="height:100%;">
    <div class="vux-demo" style="height:100%;">
      <view-box ref="viewBox">
        <sticky scroll-box="vux_view_box_body" :check-sticky-support="false" :offset="0">
          <tab v-model.number="tabIndex">
            <tab-item @on-item-click="handler">订单须知</tab-item>
            <tab-item @on-item-click="handler">填写信息</tab-item>
          </tab>
        </sticky>
        <div class="notice" v-if="tabIndex === 0">
          <group gutter="6px">
            <span>1：12306账号有多点登陆的限制，也就是说，账号若同时在多个地方登陆，就会被轮流踢下线，所以，发给我们的账号密码不要在其它地方抢票。</span>
          </group>
          <group gutter="6px">
            <span>2：预售指还未开卖的票，车没开的票都能抢到，只要车次放票出票率高达99%。</span>
          </group>
          <group gutter="6px">
            <span>3：预售没买到的车票自动为您捡漏抢票。</span>
          </group>
          <group gutter="6px">
            <span>4：您在登记后需要取消抢票或变更出行日期，请第一时间联系我们，请把宝贵的车票留给别人，谢谢。</span>
          </group>
          <group gutter="6px">
            <span>5：手里有其他票的注意，行程冲突时间交叉的不能购票，对手里票不满意的可以联系我们改签抢票。</span>
          </group>
          <group gutter="6px">
            <span>6：预售订单在预售时间点微信在线等通知，捡漏订单请6:00-23:00手机开机不要静音，特别是早6:00出票机率最高。</span>
          </group>
          <group gutter="6px">
            <span>7：发车前凭订票时登记的证件原件和E开头订单号，可在全国联网任意火车站或代售点取票。</span>
          </group>
        </div>
        <div v-else>
          <!--<marquee>-->
            <!--<marquee-item v-for="i, key in titleMessage" :key="key">{{i}}</marquee-item>-->
          <!--</marquee>-->
          <group gutter="6px">
            <x-input title="出发地(必填)" required v-model="postDate.start_site"></x-input>
            <x-input title="目的地(必填)" required v-model="postDate.end_site"></x-input>
          </group>
          <div class="userMessage"><span>尽量买始发站、大站，只要所购车票的列车经过此站就可以上车</span></div>
          <group gutter="6px">
            <calendar :disable-past="true" :replace-text-list="{'TODAY':'今'}" popup-header-title="可多选" title="出发日期(必选)" v-model="postDate.start_time"></calendar>

            <datetime v-model="postDate.train_time" title="出发时间" format="HH:mm"></datetime>

            <datetime v-model="postDate.end_train_time" title="最晚出发时间" format="HH:mm"></datetime>

            <cell :arrow-direction="showContent ? 'up' : 'down'" title="车次类型" :is-link="true" @click.native="showContent = true">
              <span v-for="list in postDate.train_type">{{list}},</span>
            </cell>

            <cell :arrow-direction="showContent3 ? 'up' : 'down'" title="席别要求" :is-link="true" @click.native="showContent3 = true">
              <span v-for="list in postDate.seat">{{list}},</span>
            </cell>

            <!--<cell :arrow-direction="showContent2 ? 'up' : 'down'" title="选择车次" :is-link="true" @click.native="trainSearch(), showContent2 = true"></cell>-->
          </group>
          <div class="userMessage"><span>尽量放宽乘车时间段多选坐席，出票几率翻倍</span></div>

          <group gutter="6px">
            <x-input title="12306账号" v-model="postDate.name_12306"></x-input>
            <x-input title="12306密码" v-model="postDate.pwd_12306"></x-input>
          </group>
          <div class="userMessage"><span>没有账号可以不填，12306同一时间只允许一处登录，请不要使用发给我们的账号去其他地方抢票</span></div>

          <group gutter="6px">
            <x-input title="姓名" v-model="userInfo.userName"></x-input>
            <x-input :max="18" title="身份证" v-model="userInfo.userId"></x-input>
            <PopupRadio title="票种" :options="options3" v-model="userInfo.userType"></PopupRadio>
          </group>

          <div class="btnStyle">
            <XButton @click.native="addUser()" type="primary" :plain="true" text="增加乘客"></XButton>
          </div>

          <group gutter="6px" v-if="postDate.user_list.length > 0">
            <x-table>
              <thead>
              <tr>
                <th>姓名</th>
                <th>身份证</th>
                <th>票种</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="user in postDate.user_list">
                <td>{{user.userName}}</td>
                <td>{{user.userId}}</td>
                <td>{{user.userType}}</td>
              </tr>
              </tbody>
            </x-table>
          </group>

          <group gutter="6px">
            <x-input :required="true" :max="11" title="手机号(必填)" v-model="postDate.user_phone"></x-input>
            <x-input :max="11" title="备用手机号" v-model="postDate.refill_phone"></x-input>
            <x-input title="微信号" v-model="postDate.user_weixin"></x-input>
          </group>
          <div class="userMessage"><span>请注意，6:00-23:00手机开机不要静音，特别是早6:00出票机率最高</span></div>

          <group gutter="6px">
            <XTextarea :max="200" v-model="postDate.user_message" :show-counter="true" title="备注"></XTextarea>
          </group>
          <div class="userMessage"><span>多选几站或者少抢几站，均可保证您先上车。卧铺不接受指定下铺，系统自动分配</span></div>


          <div class="btnStyle">
            <XButton @click.native="createUser()" type="primary" :plain="false" text="立即提交"></XButton>
          </div>

          <popup :value="showContent" @on-hide="showContent=false">
            <PopupHeader @on-click-right="showContent=false" title="可多选" :show-bottom-border="false" right-text="确定"></PopupHeader>
            <checklist title="" type="checkbox" :options="options" v-model="postDate.train_type" label-position="right"></checklist>
          </popup>

          <popup :value="showContent2" @on-hide="showContent2=false">
            <PopupHeader @on-click-right="showContent2=false" title="可多选" :show-bottom-border="false" right-text="确定"></PopupHeader>
            <checklist title="" type="checkbox" :options="options" :value="postDate.train_number" label-position="right"></checklist>
          </popup>

          <popup height="50%" :value="showContent3" @on-hide="showContent3=false">
            <PopupHeader @on-click-right="showContent3=false" title="可多选" :show-bottom-border="false" right-text="确定"></PopupHeader>
            <checklist title="" type="checkbox" :options="options2" v-model="postDate.seat" label-position="right"></checklist>
          </popup>

          <Toast v-model="isShowToast" :is-show-mask="true" :text="message" :time="2000" type="warn"></Toast>
        </div>
      </view-box>
    </div>
  </div>
</template>

<script>
import { Group, Marquee, MarqueeItem, Msg, XTextarea, XButton, XTable, Toast, ViewBox, PopupHeader, Popup, Checker, CheckerItem, PopupRadio, Checklist, Datetime, Calendar, XInput, Tab, TabItem, XHeader, Cell, Sticky } from 'vux'

export default {
  components: {
    Group,
    Marquee,
    MarqueeItem,
    Msg,
    XTable,
    XTextarea,
    Toast,
    XButton,
    PopupHeader,
    CheckerItem,
    Checker,
    Checklist,
    Cell,
    Popup,
    ViewBox,
    PopupRadio,
    Datetime,
    Calendar,
    XInput,
    XHeader,
    Sticky,
    Tab,
    TabItem
  },
  data () {
    return {
      postDate: {
        start_site: '', // 出发地
        end_site: '', // 目的地
        start_time: [], // 出发日期
        user_phone: '',
        refill_phone: '',
        user_weixin: '',
        user_message: '',
        train_time: '00:00', // 出发时间
        end_train_time: '23:59', // 最晚出发时间
        train_type: [], // 车次类型
        seat: [], // 坐席
        pwd_12306: '',
        name_12306: '',
        user_list: []
      },
      userInfo: {
        userType: '成人票',
        userName: '',
        userId: ''
      },
      titleMessage: [
        '12306账号有多点登陆的限制，也就是说，账号若同时在多个地方登陆，就会被轮流踢下线，所以，发给我们的账号密码不要在其它地方抢票',
        '预售指还未开卖的票，车没开的票都能抢到，只要车次放票出票率高达99%。'
      ],
      isShowToast: false,
      message: '提示消息',
      showContent: false,
      showContent2: false,
      showContent3: false,
      checkerList: [],
      options: [
        {
          value: 'G-高铁', key: 'G-高铁'
        },
        {
          value: 'C-城际', key: 'C-城际'
        }, {
          value: 'D-动车', key: 'D-动车'
        }, {
          value: 'Z-直达', key: 'Z-直达'
        }, {
          value: 'T-特快', key: 'T-特快'
        }, {
          value: 'K-快速', key: 'K-快速'
        }],
      options2: [
        {
          key: '商务座',
          value: '商务座'
        },
        {
          key: '特等座',
          value: '特等座'
        },
        {
          key: '一等座',
          value: '一等座'
        },
        {
          key: '二等座',
          value: '二等座'
        },
        {
          key: '高级软卧',
          value: '高级软卧'
        },
        {
          key: '软卧',
          value: '软卧'
        },
        {
          key: '硬卧',
          value: '硬卧'
        },
        {
          key: '动卧',
          value: '动卧'
        },
        {
          key: '高级动卧',
          value: '高级动卧'
        },
        {
          key: '软座',
          value: '软座'
        },
        {
          key: '硬座',
          value: '硬座'
        },
        {
          key: '无座',
          value: '无座'
        }
      ],
      options3: [
        {
          key: '成人票',
          value: '成人票'
        },
        {
          key: '儿童票',
          value: '儿童票'
        },
        {
          key: '学生票',
          value: '学生票'
        },
        {
          key: '残军票',
          value: '残军票'
        }
      ],
      time: [],
      value: '123123',
      tabIndex: 1,
      msg: 'Hello World!'
    }
  },
  methods: {
    createUser () {
      if (this.userInfo.userName === '' && this.postDate.user_list.length < 1) {
        this.isShowToast = true
        this.message = '添加购票人'
        return false
      }
      if (this.postDate.start_site === '') {
        this.isShowToast = true
        this.message = '请填写出发地'
        return false
      } else if (this.postDate.end_site === '') {
        this.isShowToast = true
        this.message = '请填写目的地'
        return false
      } else if (this.postDate.start_time.length < 1) {
        this.isShowToast = true
        this.message = '请选择出发日期'
        return false
      } else if (this.postDate.user_phone === '') {
        this.isShowToast = true
        this.message = '请填写手机号'
        return false
      }
      if (this.userInfo.userName !== '') {
        this.postDate.user_list.push(this.userInfo)
        this.userInfo = {
          userType: '成人票',
          userName: '',
          userId: ''
        }
      }
      // var req = this.postDate
      // req.seat = JSON.stringify(req.seat)
      const url = 'http://104.245.42.25/api/addcard'
      this.$http.post(url, this.postDate).then(({data}) => {
        if (data.code === 0) {
          this.$router.push({path: '/success'})
          console.log(data, '成功')
        } else {
          console.log(data, '错误')
        }
      })
    },
    addUser () {
      if (this.userInfo.userName === '') {
        this.isShowToast = true
        this.message = '请填写姓名'
        return false
      }
      if (this.userInfo.userId === '') {
        this.isShowToast = true
        this.message = '请填写身份证'
        return false
      }
      if (this.userInfo.userId.length !== 18) {
        this.isShowToast = true
        this.message = '身份证号码错误'
        return false
      }
      this.postDate.user_list.push(this.userInfo)
      this.userInfo = {
        userType: '成人票',
        userName: '',
        userId: ''
      }
    },
    trainSearch () {
      let url = '/api/abc12306/ticket/query?page=1&limit=10&trainDate=' +
        this.postDate.start_time + '&fromStation=' +
        this.postDate.start_site + '&toStation=' +
        this.postDate.end_site
      this.$http.get(url).then(({data}) => {
        if (data.code === 0) {
          console.log(data, '成功')
        } else {
          this.isShowToast = true
          this.message = data.message
          console.log(data, '错误')
        }
      })
    },
    handler (val) {
    }
  }
}
</script>
<style>
  .weui-cell{
    color: #666;
    font-size: 14px !important;
  }
</style>
<style scoped>
  .notice span {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    padding: 10px 10px;
    color: #666;
    font-size: 14px;
  }
  .btnStyle {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px 10px;
  }
  .userMessage {
    text-align: left;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 6px 10px 0;
    font-size: 12px;
    color: coral;
  }
.vux-demo {
  overflow: hidden;
}
.logo {
  width: 100px;
  height: 100px
}
</style>
