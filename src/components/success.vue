<template>
  <div style="height: 100%">
    <Msg title="提交成功" description="12306同一时间只允许一处登陆，请不要使用发给我们的账号密码去其它地方抢票。您在登记后需要取消抢票或变更出行日期，请第一时间联系我们，请把宝贵的车票留给别人。手里有其他票的注意，行程冲突时间交叉的不能直接购票，对手里票不满意的可以联系我们改签抢票。预售的票在预售时间点微信在线等通知，捡漏的票请6:00-23：00手机开机不要静音，特别是早6:00出票机率最高。"></Msg>
    <x-button @click.native="goback" plain type="primary">返回</x-button>
  </div>
</template>

<script>
  import { Msg, XButton } from 'vux'
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {}
    },
    created: function () {
    },
    methods: {
      goback () {
        this.$router.back()
      }
    },
    components: {
      Msg,
      XButton
    }
  }
</script>
